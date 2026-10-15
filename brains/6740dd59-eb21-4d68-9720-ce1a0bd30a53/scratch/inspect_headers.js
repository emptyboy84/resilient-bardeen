const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(workspaceRoot, 'data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'));
  const ws = wb.getWorksheet('기업 정보');
  for (let r = 1; r <= 5; r++) {
    const row = ws.getRow(r);
    console.log(`Row ${r}:`, JSON.stringify(row.values));
  }
}

main().catch(console.error);
