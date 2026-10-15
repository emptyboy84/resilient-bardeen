const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

const BAE_RANGES = [
  [702, 801],
  [1001, 1100],
  [1801, 1900],
  [2401, 2500],
  [3301, 3400],
  [5001, 5500],
  [11847, 12346]
];

function isBaeRow(r) {
  for (const [start, end] of BAE_RANGES) {
    if (r >= start && r <= end) return true;
  }
  return false;
}

function getFillColor(cell) {
  if (!cell || !cell.fill) return null;
  const fill = cell.fill;
  if (fill.type === 'pattern' && fill.pattern === 'solid' && fill.fgColor) {
    return fill.fgColor.argb || fill.fgColor.theme || 'FILLED';
  }
  return null;
}

function cleanVal(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    if (v.text) return String(v.text).trim();
    if (v.result !== undefined) return String(v.result).trim();
    return JSON.stringify(v);
  }
  return String(v).trim();
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

function analyzeCorpNo(corpNo) {
  if (!corpNo) return { valid: false, reason: 'EMPTY' };
  const clean = String(corpNo).replace(/[^0-9]/g, '');
  if (clean.length !== 13) return { valid: false, reason: `LEN_${clean.length}` };
  
  const courtCode = clean.substring(0, 4);
  const entityKind = clean.substring(4, 6);
  const serial = clean.substring(6, 12);
  const checkDigit = Number(clean[12]);

  const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(clean[i]) * weights[i];
  }
  const remainder = sum % 10;
  const calcCheck = (10 - remainder) % 10;
  const match = (checkDigit === calcCheck);

  return {
    clean,
    formatted: `${clean.substring(0, 6)}-${clean.substring(6)}`,
    courtCode,
    entityKind,
    serial,
    checkDigit,
    calcCheck,
    match
  };
}

function getBizTaxType(bizno) {
  if (!bizno) return 'UNKNOWN';
  const clean = String(bizno).replace(/[^0-9]/g, '');
  if (clean.length !== 10) return 'UNKNOWN';
  const mid = clean.substring(3, 5);
  const midNum = Number(mid);
  if ((midNum >= 1 && midNum <= 79) || (midNum >= 90 && midNum <= 99)) return '개인사업자';
  if (['81', '86', '87', '88'].includes(mid)) return '영리법인본점';
  if (mid === '85') return '영리법인지점';
  if (mid === '82') return '비영리법인';
  if (mid === '84') return '외국법인국내영업소';
  if (mid === '83') return '국가기관/지자체';
  if (mid === '33') return '사내근로복지기금';
  return '기타';
}

async function extractFileData(filePath) {
  console.log(`[READING] ${filePath}...`);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업 정보');
  const rowsData = {};

  for (let r = 2; r <= 20434; r++) {
    if (!isBaeRow(r)) continue;
    const row = ws.getRow(r);
    const cells = [];
    const fills = [];
    for (let c = 1; c <= 25; c++) {
      const cell = row.getCell(c);
      cells[c] = cleanVal(cell.value);
      fills[c] = getFillColor(cell);
    }
    rowsData[r] = { cells, fills };
  }
  console.log(`[DONE] Extracted ${Object.keys(rowsData).length} rows from ${filePath}`);
  return rowsData;
}

async function main() {
  const pathFinal = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';
  const pathTarget = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';

  // 1. Extract Final
  const finalData = await extractFileData(pathFinal);

  // 2. Extract Target
  const targetData = await extractFileData(pathTarget);

  console.log('\n======================================================');
  console.log('         배현명 담당 1,500행 전수 비교 및 재검증 결과        ');
  console.log('======================================================\n');

  // Let's compare
  let valDiffCount = 0;
  let fillDiffCount = 0;
  const valDiffsByCol = {};
  const rowsWithValDiff = new Set();
  const sampleDiffs = [];

  for (let r = 2; r <= 20434; r++) {
    if (!isBaeRow(r)) continue;
    const fRow = finalData[r];
    const tRow = targetData[r];

    if (!fRow || !tRow) {
      console.log(`Row ${r} missing in one of files!`);
      continue;
    }

    for (let c = 1; c <= 25; c++) {
      const fv = fRow.cells[c] || '';
      const tv = tRow.cells[c] || '';
      if (fv !== tv) {
        valDiffCount++;
        rowsWithValDiff.add(r);
        valDiffsByCol[c] = (valDiffsByCol[c] || 0) + 1;
        if (sampleDiffs.length < 20) {
          sampleDiffs.push({
            row: r,
            col: c,
            company: fRow.cells[3] || tRow.cells[3],
            finalVal: fv,
            targetVal: tv
          });
        }
      }

      const ff = fRow.fills[c];
      const tf = tRow.fills[c];
      if (ff !== tf) {
        fillDiffCount++;
      }
    }
  }

  console.log(`총 값 불일치 셀 수: ${valDiffCount}개 (영향받은 행: ${rowsWithValDiff.size}개)`);
  console.log(`총 채우기색 불일치 셀 수: ${fillDiffCount}개`);
  console.log('컬럼별 값 불일치 발생 건수:', valDiffsByCol);
  console.log('\n[값 불일치 대표 샘플 (최대 20건)]');
  console.log(JSON.stringify(sampleDiffs, null, 2));

  // Now perform deep audit on both finalData and targetData
  console.log('\n------------------------------------------------------');
  console.log('     데이터 무결성 검증 (사업자번호, 법인번호, 개인사업자 오등록 등)    ');
  console.log('------------------------------------------------------');

  function auditDataset(name, data) {
    let emptyBiz = 0;
    let invalidBiz = [];
    let indivWithCorp = [];
    let corpCheckMismatch = [];
    let corpMissing = [];
    let emptyAddr = [];
    let emptyZip = [];
    let emptyNice = [];
    let totalFilledCorp = 0;

    for (const rStr of Object.keys(data)) {
      const r = Number(rStr);
      const row = data[r];
      const company = row.cells[3];
      const bizno = row.cells[4] || row.cells[24];
      const corpNo = row.cells[25];
      const zip = row.cells[6];
      const addr = row.cells[7];
      const nice = row.cells[18];

      const taxType = getBizTaxType(bizno);
      const isCorpName = company.includes('(주)') || company.includes('주식회사') || company.includes('㈜') || company.includes('유한회사') || company.includes('합자회사');
      const isCorp = ['영리법인본점', '영리법인지점', '비영리법인', '사내근로복지기금'].includes(taxType) || isCorpName;

      // 1. BizNo check
      if (!bizno) {
        emptyBiz++;
      } else if (!isValidBizNo(bizno)) {
        invalidBiz.push({ row: r, company, bizno });
      }

      // 2. CorpNo check
      if (corpNo) {
        totalFilledCorp++;
        const corpAnalysis = analyzeCorpNo(corpNo);
        // If it is individual business
        if (taxType === '개인사업자' && !isCorpName) {
          indivWithCorp.push({ row: r, company, bizno, corpNo, taxType });
        } else if (!corpAnalysis.match) {
          corpCheckMismatch.push({
            row: r,
            company,
            bizno,
            corpNo,
            taxType,
            entityKind: corpAnalysis.entityKind,
            checkDigit: corpAnalysis.checkDigit,
            calcCheck: corpAnalysis.calcCheck
          });
        }
      } else {
        if (isCorp && ['영리법인본점'].includes(taxType)) {
          corpMissing.push({ row: r, company, bizno, taxType });
        }
      }

      // 3. Address & Zip
      if (!addr) emptyAddr.push({ row: r, company });
      if (!zip) emptyZip.push({ row: r, company });
      if (!nice) emptyNice.push({ row: r, company });
    }

    console.log(`\n<<< [${name}] 검증 요약 >>>`);
    console.log(`- 사업자번호 누락: ${emptyBiz}건`);
    console.log(`- 사업자번호 체크섬 오류: ${invalidBiz.length}건`);
    console.log(`- 법인번호 입력된 건수: ${totalFilledCorp}건 / 1500건`);
    console.log(`- 개인사업자인데 법인번호 기재: ${indivWithCorp.length}건`);
    if (indivWithCorp.length > 0) {
      console.log('  목록:', JSON.stringify(indivWithCorp, null, 2));
    }
    console.log(`- 법인번호 체크섬 불일치: ${corpCheckMismatch.length}건`);
    if (corpCheckMismatch.length > 0) {
      console.log('  목록:', JSON.stringify(corpCheckMismatch, null, 2));
    }
    console.log(`- 영리법인본점인데 법인번호 미기재: ${corpMissing.length}건`);
    console.log(`- 주소 누락: ${emptyAddr.length}건`);
    console.log(`- 우편번호 누락: ${emptyZip.length}건`);
    console.log(`- NICE업종 누락: ${emptyNice.length}건`);
  }

  auditDataset('최종본_수정완료.xlsx (또는 git 레포 마스터)', finalData);
  auditDataset('현재 바탕화면의 배현명.xlsx (12:09 수정)', targetData);
}

main().catch(err => console.error(err));
