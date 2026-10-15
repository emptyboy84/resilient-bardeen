const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data\\node_modules\\exceljs');

async function inspectRow() {
  const filePath = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\add_ace_hightech_data\\data\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.getWorksheet('기업 정보');
  const headerRow = sheet.getRow(1);
  const row20414 = sheet.getRow(20414);

  console.log('Columns count:', headerRow.cellCount);
  for (let i = 1; i <= Math.max(headerRow.cellCount, row20414.cellCount); i++) {
    const header = headerRow.getCell(i).value;
    const val = row20414.getCell(i).value;
    console.log(`Col ${i} [${header}]: ${JSON.stringify(val)}`);
  }
}

inspectRow().catch(console.error);
