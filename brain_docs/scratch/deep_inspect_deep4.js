const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');

async function deeplyInspectDeep4() {
  const f = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(f);
  const ws = wb.worksheets[0];

  console.log('Worksheet name:', ws.name);
  console.log('Dimensions:', ws.rowCount, 'x', ws.columnCount);

  // Column widths
  const colWidths = ws.columns.map((col, idx) => ({
    col: idx + 1,
    header: ws.getRow(1).getCell(idx + 1).value,
    width: col.width
  }));
  console.log('Column widths:', colWidths);

  // Row 1 header style
  console.log('--- Row 1 styles ---');
  for (let c = 1; c <= ws.columnCount; c++) {
    const cell = ws.getRow(1).getCell(c);
    console.log(`H${c} (${cell.value}): fill=${JSON.stringify(cell.fill)}, font=${JSON.stringify(cell.font)}, align=${JSON.stringify(cell.alignment)}, border=${JSON.stringify(cell.border)}`);
  }

  // Row 2 styles
  console.log('--- Row 2 styles ---');
  for (let c = 1; c <= ws.columnCount; c++) {
    const cell = ws.getRow(2).getCell(c);
    console.log(`R2 C${c} (${cell.value}): fill=${JSON.stringify(cell.fill)}, font=${JSON.stringify(cell.font)}, align=${JSON.stringify(cell.alignment)}, border=${JSON.stringify(cell.border)}`);
  }

  // Row 14 styles (which had green)
  console.log('--- Row 14 styles (green phone) ---');
  for (let c = 1; c <= ws.columnCount; c++) {
    const cell = ws.getRow(14).getCell(c);
    console.log(`R14 C${c} (${cell.value}): fill=${JSON.stringify(cell.fill)}, font=${JSON.stringify(cell.font)}, align=${JSON.stringify(cell.alignment)}, border=${JSON.stringify(cell.border)}`);
  }

  // Check what rows are green across the sheet:
  // Is it just cell 10, or is the whole row green, or something else?
  const rowGreenCounts = {};
  for (let r = 2; r <= Math.min(ws.rowCount, 100); r++) {
    let rowGreen = 0;
    for (let c = 1; c <= ws.columnCount; c++) {
      const cell = ws.getRow(r).getCell(c);
      if (cell.fill && cell.fill.fgColor && (cell.fill.fgColor.argb === 'FFC6EFCE' || cell.fill.fgColor.theme)) {
        rowGreen++;
      }
    }
    if (rowGreen > 0) rowGreenCounts[r] = rowGreen;
  }
  console.log('Row green counts for rows 2-100:', rowGreenCounts);
}

deeplyInspectDeep4().catch(console.error);
