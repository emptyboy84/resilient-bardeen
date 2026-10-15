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

async function detailedAudit() {
  const targetPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetPath);
  const ws = wb.getWorksheet('기업 정보');

  const p1_indivCorp = [];
  const p1_corpCheckFail = [];
  const p1_missingZip = [];
  const p1_missingNice = [];

  const p2_indivCorp = [];
  const p2_corpCheckFail = [];
  const p2_missingZip = [];
  const p2_missingNice = [];
  const p2_corpMissing = [];

  for (let r = 2; r <= 20434; r++) {
    const row = ws.getRow(r);
    const assignee = row.getCell(1).value;
    if (!assignee || !String(assignee).includes('배현명')) continue;

    const getVal = (col) => {
      const v = row.getCell(col).value;
      if (v === null || v === undefined) return '';
      if (typeof v === 'object') return (v.text || '').trim();
      return String(v).trim();
    };

    const company = getVal(3);
    const bizno = getVal(4) || getVal(24);
    const corpNo = getVal(25);
    const zip = getVal(6);
    const addr = getVal(7);
    const nice = getVal(18);
    const bType = getBizType(bizno);
    const isCorpName = company.includes('(주)') || company.includes('주식회사') || company.includes('㈜');
    const isCorp = ['영리법인본점', '영리법인지점', '비영리법인'].includes(bType) || isCorpName;

    const item = { row: r, company, bizno, corpNo, zip, addr, nice, bType };

    if (r < 11847) {
      if (!isCorp && corpNo) p1_indivCorp.push(item);
      if (isCorp && corpNo && !isValidCorpNo(corpNo)) p1_corpCheckFail.push(item);
      if (!zip) p1_missingZip.push(item);
      if (!nice) p1_missingNice.push(item);
    } else {
      if (!isCorp && corpNo) p2_indivCorp.push(item);
      if (isCorp && corpNo && !isValidCorpNo(corpNo)) p2_corpCheckFail.push(item);
      if (isCorp && !corpNo) p2_corpMissing.push(item);
      if (!zip) p2_missingZip.push(item);
      if (!nice) p2_missingNice.push(item);
    }
  }

  console.log('=== [구간 1: 702~5500행] ===');
  console.log('개인사업자인데 법인번호 기재 (5건):', JSON.stringify(p1_indivCorp, null, 2));
  console.log('법인번호 체크섬 불일치 (11건):', JSON.stringify(p1_corpCheckFail, null, 2));
  console.log('우편번호 누락 (6건):', JSON.stringify(p1_missingZip, null, 2));
  console.log('NICE업종 누락 (2건):', JSON.stringify(p1_missingNice, null, 2));

  console.log('\n=== [구간 2: 11847~12346행] ===');
  console.log('개인사업자인데 법인번호 기재 (2건):', JSON.stringify(p2_indivCorp, null, 2));
  console.log('법인번호 체크섬 불일치 (0건):', JSON.stringify(p2_corpCheckFail, null, 2));
  console.log('법인사업자인데 법인번호 누락 (22건):', JSON.stringify(p2_corpMissing, null, 2));
  console.log('우편번호 누락 (15건):', JSON.stringify(p2_missingZip, null, 2));
  console.log('NICE업종 누락 (5건):', JSON.stringify(p2_missingNice, null, 2));
}

detailedAudit().catch(err => console.error(err));
