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

async function auditRepoFile() {
  const filePath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업 정보');

  const rows500 = [];
  for (let r = 11847; r <= 12346; r++) {
    const row = ws.getRow(r);
    const getVal = (col) => {
      const v = row.getCell(col).value;
      if (v === null || v === undefined) return '';
      if (typeof v === 'object') {
        if (v.text) return String(v.text).trim();
        if (v.result) return String(v.result).trim();
      }
      return String(v).trim();
    };

    rows500.push({
      rowNum: r,
      company: getVal(3),
      biznoCol4: getVal(4),
      rep: getVal(5),
      zip: getVal(6),
      address: getVal(7),
      phone: getVal(8),
      fax: getVal(9),
      homepage: getVal(10),
      email: getVal(11),
      empCount: getVal(15),
      bizTypeNice: getVal(18),
      corpNo: getVal(25),
      settleMonth: getVal(31),
      bizLarge: getVal(48),
      bizMid: getVal(49),
      bizSmall: getVal(50),
    });
  }

  console.log(`[REPO 11847-12346] Total rows: ${rows500.length}`);

  let indivWithCorpNo = [];
  let corpWithoutCorpNo = [];
  let corpInvalidChecksum = [];

  rows500.forEach(r => {
    const b = r.biznoCol4;
    const bType = getBizType(b);
    const isCorpName = r.company.includes('(주)') || r.company.includes('주식회사') || r.company.includes('㈜');
    const isCorp = ['영리법인본점', '영리법인지점', '비영리법인'].includes(bType) || isCorpName;

    if (isCorp) {
      if (!r.corpNo) corpWithoutCorpNo.push(r);
      else if (!isValidCorpNo(r.corpNo)) corpInvalidChecksum.push(r);
    } else {
      if (r.corpNo) indivWithCorpNo.push(r);
    }
  });

  console.log(`개인사업자인데 법인번호 기재: ${indivWithCorpNo.length}건`);
  if (indivWithCorpNo.length > 0) {
    console.log(indivWithCorpNo.map(r => `행 ${r.rowNum}: ${r.company} (${r.biznoCol4}, 법인번호: ${r.corpNo})`));
  }
  console.log(`법인사업자인데 법인번호 누락: ${corpWithoutCorpNo.length}건`);
  console.log(`법인번호 체크섬 불일치: ${corpInvalidChecksum.length}건`);

  const missingZip = rows500.filter(r => !r.zip);
  const missingAddr = rows500.filter(r => !r.address);
  console.log(`우편번호 누락: ${missingZip.length}건, 주소 누락: ${missingAddr.length}건`);

  const missingLarge = rows500.filter(r => !r.bizLarge);
  console.log(`대분류 누락: ${missingLarge.length}건`);
  const hpCount = rows500.filter(r => !!r.homepage).length;
  const emailCount = rows500.filter(r => !!r.email).length;
  console.log(`홈페이지: ${hpCount}건, 이메일: ${emailCount}건`);
}

auditRepoFile().catch(err => console.error(err));
