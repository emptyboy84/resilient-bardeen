const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(workspaceRoot, 'data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'));
  const ws = wb.getWorksheet('기업 정보');
  console.log('Total rows in ws:', ws.rowCount);
  for (let r = 12340; r <= 12360; r++) {
    const row = ws.getRow(r);
    const v = Array.isArray(row.values) ? row.values.slice(1) : [];
    if (v.length > 0 && v.some(Boolean)) {
      console.log(`Row ${r}:`, v[0], v[1], v[2], v[3]);
    } else {
      console.log(`Row ${r}: empty`);
    }
  }
}

main().catch(console.error);
