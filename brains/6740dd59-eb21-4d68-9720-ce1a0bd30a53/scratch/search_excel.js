const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const wb = new ExcelJS.Workbook();
  console.log('Reading Excel file...');
  await wb.xlsx.readFile(path.join(workspaceRoot, 'data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'));
  console.log('Sheets:', wb.worksheets.map(s => s.name));
  
  for (const ws of wb.worksheets) {
    console.log(`Checking sheet: ${ws.name}, rowCount: ${ws.rowCount}`);
    ws.eachRow((row, rowNumber) => {
      const vals = Array.isArray(row.values) ? row.values.slice(1) : Object.values(row.values);
      const text = vals.join(' ');
      if (text.includes('교보') || text.includes('051-709-5958') || text.includes('NC백화점')) {
        console.log(`Found in ${ws.name} row ${rowNumber}:`, JSON.stringify(vals));
      }
    });
  }
  console.log('Done searching.');
}

main().catch(console.error);
