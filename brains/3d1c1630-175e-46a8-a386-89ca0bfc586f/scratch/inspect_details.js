const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function inspect() {
  const wb = new ExcelJS.Workbook();
  const filePath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  console.log('Loading workbook...');
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet(1);
  console.log('Sheet name:', ws.name);
  console.log('Total rows:', ws.rowCount);

  // Row 1 headers
  const headerRow = ws.getRow(1);
  const headers = [];
  for (let c = 1; c <= ws.columnCount; c++) {
    headers.push({ col: c, value: headerRow.getCell(c).value });
  }
  console.log('Headers:', JSON.stringify(headers, null, 2));

  // Find all distinct assignees / names in Column 1 (or wherever the assignee is)
  const assigneeCounts = {};
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const val = row.getCell(1).value;
    const str = val ? String(val).trim() : '(empty)';
    assigneeCounts[str] = (assigneeCounts[str] || 0) + 1;
  }
  console.log('Column 1 distribution:', JSON.stringify(assigneeCounts, null, 2));

  // Check row range for '배현명'
  let minBae = Infinity;
  let maxBae = -1;
  let baeCount = 0;
  for (let r = 2; r <= ws.rowCount; r++) {
    const val = ws.getRow(r).getCell(1).value;
    if (val && String(val).includes('배현명')) {
      baeCount++;
      if (r < minBae) minBae = r;
      if (r > maxBae) maxBae = r;
    }
  }
  console.log(`배현명 rows: count=${baeCount}, minRow=${minBae}, maxRow=${maxBae}`);

  // Let's sample row 2, minBae, and row 11847
  console.log('Row 2 sample:', JSON.stringify(ws.getRow(2).values));
  if (minBae !== Infinity) {
    console.log(`Row ${minBae} sample:`, JSON.stringify(ws.getRow(minBae).values));
  }
  if (ws.rowCount >= 11847) {
    console.log('Row 11847 sample:', JSON.stringify(ws.getRow(11847).values));
  }
}

inspect().catch(err => console.error(err));
