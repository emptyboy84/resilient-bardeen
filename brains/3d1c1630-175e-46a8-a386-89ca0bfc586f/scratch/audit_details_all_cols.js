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

function clean(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    if (v.text) return String(v.text).trim();
    if (v.result !== undefined) return String(v.result).trim();
    return '';
  }
  return String(v).trim();
}

async function auditDetails() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx');
  const ws = wb.getWorksheet('기업 정보');

  let emptyRep = 0;
  let emptyPhone = 0;
  let emptyAddr = 0;
  let emptyZip = 0;
  let emptyNice = 0;
  let closedCount = 0;
  let suspendedCount = 0;
  let normalCount = 0;

  const phoneFormats = [];
  const repSamples = [];

  for (let r = 2; r <= 20434; r++) {
    if (!isBaeRow(r)) continue;
    const row = ws.getRow(r);
    const status = clean(row.getCell(2).value);
    const name = clean(row.getCell(3).value);
    const rep = clean(row.getCell(5).value);
    const zip = clean(row.getCell(6).value);
    const addr = clean(row.getCell(7).value);
    const phone = clean(row.getCell(8).value);
    const nice = clean(row.getCell(18).value);

    if (status.includes('폐업')) closedCount++;
    else if (status.includes('휴업')) suspendedCount++;
    else normalCount++;

    if (!rep) emptyRep++;
    if (!phone) emptyPhone++;
    if (!addr) emptyAddr++;
    if (!zip) emptyZip++;
    if (!nice) emptyNice++;
  }

  console.log('=== 배현명 1,500행 컬럼별 현황 (최종본_수정완료.xlsx 기준) ===');
  console.log(`- 사업자 상태: 정상 ${normalCount}건, 폐업 ${closedCount}건, 휴업 ${suspendedCount}건`);
  console.log(`- 대표자 누락: ${emptyRep}건`);
  console.log(`- 전화번호 누락: ${emptyPhone}건`);
  console.log(`- 주소 누락: ${emptyAddr}건`);
  console.log(`- 우편번호 누락: ${emptyZip}건`);
  console.log(`- NICE업종 누락: ${emptyNice}건`);
}

auditDetails().catch(err => console.error(err));
