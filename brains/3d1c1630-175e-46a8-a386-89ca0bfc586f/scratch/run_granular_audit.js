const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

function getBizType(bizno) {
  if (!bizno) return 'UNKNOWN';
  const clean = String(bizno).replace(/[^0-9]/g, '');
  if (clean.length !== 10) return 'UNKNOWN';
  const mid = clean.substring(3, 5);
  const midNum = Number(mid);
  if ((midNum >= 1 && midNum <= 79) || (midNum >= 90 && midNum <= 99)) return '개인사업자';
  if (['81', '86', '87', '88'].includes(mid)) return '영리법인본점';
  if (mid === '85') return '영리법인지점';
  if (mid === '82') return '비영리법인';
  if (mid === '33') return '사내근로복지기금/단체';
  return '기타';
}

function isValidCorpNo(corpNo) {
  if (!corpNo) return false;
  const clean = String(corpNo).replace(/[^0-9]/g, '');
  if (clean.length !== 13) return false;
  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(clean[i]) * weights[i];
  }
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;
  return Number(clean[12]) === checkDigit;
}

function isValidBizNo(bizno) {
  if (!bizno) return false;
  const clean = String(bizno).replace(/[^0-9]/g, '');
  if (clean.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(clean[i]) * weights[i];
  }
  sum += Math.floor((Number(clean[8]) * 5) / 10);
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;
  return Number(clean[9]) === checkDigit;
}

async function runGranularAudit() {
  const targetPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const finalUpdatedPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';

  console.log('Loading Target workbook...');
  const wbTarget = new ExcelJS.Workbook();
  await wbTarget.xlsx.readFile(targetPath);
  const wsTarget = wbTarget.getWorksheet('기업 정보');

  console.log('Loading FinalUpdated workbook (for reference)...');
  const wbFinal = new ExcelJS.Workbook();
  await wbFinal.xlsx.readFile(finalUpdatedPath);
  const wsFinal = wbFinal.getWorksheet('기업 정보');

  const report = {
    targetFile: targetPath,
    totalWorksheets: wbTarget.worksheets.map(w => w.name),
    baeRowsTotal: 0,
    part1_1000: {
      range: '702 ~ 5500',
      totalCount: 0,
      statusCount: {},
      invalidBizNo: [],
      indivWithCorpNo: [],
      corpWithoutCorpNo: [],
      corpInvalidChecksum: [],
      missingZip: [],
      missingAddr: [],
      missingBizType: [],
      missingBizLarge: []
    },
    part2_500: {
      range: '11847 ~ 12346',
      totalCount: 0,
      statusCount: {},
      invalidBizNo: [],
      indivWithCorpNo: [],
      corpWithoutCorpNo: [],
      corpInvalidChecksum: [],
      missingZip: [],
      missingAddr: [],
      missingBizType: [],
      missingBizLarge: [],
      diffsWithFinalCompleted: []
    }
  };

  for (let r = 2; r <= 20434; r++) {
    const rowT = wsTarget.getRow(r);
    const assignee = rowT.getCell(1).value;
    if (!assignee || !String(assignee).includes('배현명')) continue;

    report.baeRowsTotal++;

    const getT = (col) => {
      const v = rowT.getCell(col).value;
      if (v === null || v === undefined) return '';
      if (typeof v === 'object') return (v.text || '').trim();
      return String(v).trim();
    };

    const isPart1 = (r < 11847);
    const part = isPart1 ? report.part1_1000 : report.part2_500;
    part.totalCount++;

    const status = getT(2) || '정상(공란)';
    part.statusCount[status] = (part.statusCount[status] || 0) + 1;

    const company = getT(3);
    const bizno = getT(4) || getT(24);
    const corpNo = getT(25);
    const zip = getT(6);
    const addr = getT(7);
    const niceType = getT(18);
    const largeType = getT(48);

    const bType = getBizType(bizno);
    const isCorpName = company.includes('(주)') || company.includes('주식회사') || company.includes('㈜');
    const isCorp = ['영리법인본점', '영리법인지점', '비영리법인'].includes(bType) || isCorpName;

    // Bizno check
    if (!isValidBizNo(bizno)) {
      part.invalidBizNo.push({ row: r, company, bizno });
    }

    // Corp no check
    if (isCorp) {
      if (!corpNo) {
        part.corpWithoutCorpNo.push({ row: r, company, bizno, bType });
      } else if (!isValidCorpNo(corpNo)) {
        part.corpInvalidChecksum.push({ row: r, company, corpNo, bizno });
      }
    } else {
      if (corpNo) {
        part.indivWithCorpNo.push({ row: r, company, bizno, corpNo, bType });
      }
    }

    // Missing Zip / Addr
    if (!zip) part.missingZip.push({ row: r, company });
    if (!addr) part.missingAddr.push({ row: r, company });

    // Missing NICE type
    if (!niceType) part.missingBizType.push({ row: r, company });
    if (!largeType) part.missingBizLarge.push({ row: r, company });

    // For Part 2, check diffs with FinalCompleted
    if (!isPart1) {
      const rowF = wsFinal.getRow(r);
      const getF = (col) => {
        const v = rowF.getCell(col).value;
        if (v === null || v === undefined) return '';
        if (typeof v === 'object') return (v.text || '').trim();
        return String(v).trim();
      };
      
      const diffFields = [];
      const colsToCheck = [
        [6, '우편번호'], [7, '주소'], [8, '전화번호'], [9, '팩스번호'],
        [10, '홈페이지'], [11, '이메일'], [18, '업종(NICE)'], [25, '법인번호'],
        [48, '업종_대'], [49, '업종_중'], [50, '업종_소']
      ];
      colsToCheck.forEach(([col, name]) => {
        const valT = getT(col);
        const valF = getF(col);
        if (valT !== valF) {
          diffFields.push({ col, name, target: valT, final: valF });
        }
      });
      if (diffFields.length > 0) {
        part.diffsWithFinalCompleted.push({ row: r, company, diffFields });
      }
    }
  }

  console.log('AUDIT SUMMARY:');
  console.log(`Total 배현명 rows: ${report.baeRowsTotal}`);
  console.log('\n--- Part 1 (702-5500, 1000 rows) ---');
  console.log('Status count:', JSON.stringify(report.part1_1000.statusCount));
  console.log('Invalid BizNo:', report.part1_1000.invalidBizNo.length);
  console.log('Individual with CorpNo:', report.part1_1000.indivWithCorpNo.length);
  console.log('Corp without CorpNo:', report.part1_1000.corpWithoutCorpNo.length);
  console.log('Corp invalid checksum:', report.part1_1000.corpInvalidChecksum.length);
  console.log('Missing Zip:', report.part1_1000.missingZip.length);
  console.log('Missing Addr:', report.part1_1000.missingAddr.length);
  console.log('Missing NICE type:', report.part1_1000.missingBizType.length);
  console.log('Missing Large type:', report.part1_1000.missingBizLarge.length);

  console.log('\n--- Part 2 (11847-12346, 500 rows) ---');
  console.log('Status count:', JSON.stringify(report.part2_500.statusCount));
  console.log('Invalid BizNo:', report.part2_500.invalidBizNo.length);
  console.log('Individual with CorpNo:', report.part2_500.indivWithCorpNo.length);
  console.log('Corp without CorpNo:', report.part2_500.corpWithoutCorpNo.length);
  console.log('Corp invalid checksum:', report.part2_500.corpInvalidChecksum.length);
  console.log('Missing Zip:', report.part2_500.missingZip.length);
  console.log('Missing Addr:', report.part2_500.missingAddr.length);
  console.log('Missing NICE type:', report.part2_500.missingBizType.length);
  console.log('Missing Large type:', report.part2_500.missingBizLarge.length);
  console.log('Rows differing from FinalCompleted (3,026 orange cells version):', report.part2_500.diffsWithFinalCompleted.length);

  // Save report to scratch json
  fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/3d1c1630-175e-46a8-a386-89ca0bfc586f/scratch/granular_audit_report.json', JSON.stringify(report, null, 2), 'utf-8');
  console.log('\nSaved full report to granular_audit_report.json');
}

runGranularAudit().catch(err => console.error(err));
