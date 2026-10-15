const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');
const fs = require('fs');

async function runQA() {
  const f_target = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const f_new = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명_전화번호통합검증_261015.xlsx';

  console.log('=== QA Verification Report ===');
  console.log('1. Checking file existence:');
  console.log('Target exists:', fs.existsSync(f_target));
  console.log('New Excel exists:', fs.existsSync(f_new), 'Size:', fs.statSync(f_new).size);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f_new);
  const ws = wb.worksheets[0];

  console.log('2. Checking Row Counts: ws.rowCount =', ws.rowCount);

  // Check specific test cases
  const tests = [
    { r: 282, seq: 281, name: '인코어', expected: '070-4693-7034' },
    { r: 283, seq: 282, name: '(주)스페이스포트', expected: '070-7122-7679' },
    { r: 306, seq: 305, name: '(주)에스아이엠테크', expected: '051-714-1070' },
    { r: 316, seq: 315, name: '(주)웨이브그램', expected: '051-711-0305' },
    { r: 319, seq: 318, name: '(주)온클레브', expected: '0504-1361-2922' },
    { r: 324, seq: 323, name: '(주)테렌즈', expected: '051-791-2021' },
    { r: 328, seq: 327, name: '(주)지앨', expected: '070-4231-0729' },
    { r: 336, seq: 335, name: '(주)비에이블랩', expected: '010-4343-7707' },
    { r: 337, seq: 336, name: '(주)레드에셋', expected: '1833-7169' },
    { r: 345, seq: 344, name: '언커먼랩(주)', expected: '051-711-0805' },
    { r: 357, seq: 356, name: '(주)내방니방', expected: '010-3135-3104' },
    { r: 367, seq: 366, name: '(주)새온아이티', expected: '070-4012-1862' },
    { r: 368, seq: 367, name: '(주)호랑이얼굴', expected: '070-7704-5700' },
    { r: 392, seq: 391, name: '(주)팀리부뜨', expected: '1644-1664' },
    { r: 416, seq: 415, name: '(주)나인박스', expected: '1670-0260' },
    { r: 441, seq: 440, name: '(주)사운드리더', expected: '0507-1301-6920' },
    { r: 448, seq: 447, name: '(주)빅웨이브카', expected: '1551-8880' },
    { r: 461, seq: 460, name: '나눔솔루션', expected: '02-830-7036' }
  ];

  let passed = 0;
  for (const t of tests) {
    const row = ws.getRow(t.r);
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const phone = (row.getCell(10).value || '').toString().trim();
    const isMatch = (phone === t.expected);
    if (isMatch) passed++;
    console.log(`Test R${t.r} [Seq ${seq} ${name}]: Phone="${phone}" | Expected="${t.expected}" -> ${isMatch ? 'PASS' : 'FAIL'}`);
  }

  console.log(`\nTest Result: ${passed}/${tests.length} passed!`);

  // Check phone format validity
  let invalidFormatCount = 0;
  for (let r = 2; r <= ws.rowCount; r++) {
    const p = (ws.getRow(r).getCell(10).value || '').toString().trim();
    if (p) {
      // Must look like a phone number
      if (!/^[0-9\-]+$/.test(p)) {
        console.log(`Warning: invalid character in row ${r}: "${p}"`);
        invalidFormatCount++;
      }
    }
  }
  console.log('Phone format invalid characters count:', invalidFormatCount);
}

runQA().catch(console.error);
