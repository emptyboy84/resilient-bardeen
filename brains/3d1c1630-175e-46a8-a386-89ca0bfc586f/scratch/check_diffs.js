const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function checkDiffs() {
  const desktopPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const repoPath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';

  console.log('Loading Desktop...');
  const wbD = new ExcelJS.Workbook();
  await wbD.xlsx.readFile(desktopPath);
  const wsD = wbD.getWorksheet('기업 정보');

  console.log('Loading Repo...');
  const wbR = new ExcelJS.Workbook();
  await wbR.xlsx.readFile(repoPath);
  const wsR = wbR.getWorksheet('기업 정보');

  console.log('\n--- Row 11847 Comparison ---');
  for (let c = 1; c <= 25; c++) {
    const vD = wsD.getRow(11847).getCell(c).value;
    const vR = wsR.getRow(11847).getCell(c).value;
    const colName = wsD.getRow(1).getCell(c).value;
    console.log(`Col ${c} (${colName}): Desktop = ${JSON.stringify(vD)} | Repo = ${JSON.stringify(vR)}`);
  }

  console.log('\n--- Checking why Desktop has missing zip/address in row 11847 ---');
  // Did the Desktop file have 11847-12346 not yet updated with merged_500_perfect.tsv?
  // Let's check row 11847 in merged_500_perfect.tsv
  const tsvPath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/merged_500_perfect.tsv';
  const tsvLines = fs.readFileSync(tsvPath, 'utf-8').split('\n').filter(l => l.trim().length > 0);
  console.log('merged_500_perfect.tsv line 1 (row 11847):');
  console.log(tsvLines[0].split('\t'));

  // Count differences between Desktop and Repo across 11847 to 12346
  let rowsWithDiff = 0;
  for (let r = 11847; r <= 12346; r++) {
    let diffInRow = false;
    for (let c = 1; c <= 58; c++) {
      const vD = wsD.getRow(r).getCell(c).value;
      const vR = wsR.getRow(r).getCell(c).value;
      const sD = (vD === null || vD === undefined) ? '' : (typeof vD === 'object' ? (vD.text || '') : String(vD)).trim();
      const sR = (vR === null || vR === undefined) ? '' : (typeof vR === 'object' ? (vR.text || '') : String(vR)).trim();
      if (sD !== sR) {
        diffInRow = true;
        break;
      }
    }
    if (diffInRow) rowsWithDiff++;
  }
  console.log(`Rows with differences between Desktop and Repo in 11847-12346: ${rowsWithDiff} / 500`);

  // Let's check fill colors in Repo vs Desktop for 11847
  const fillD = wsD.getRow(11847).getCell(3).fill;
  const fillR = wsR.getRow(11847).getCell(3).fill;
  console.log('Fill Desktop row 11847 col 3:', JSON.stringify(fillD));
  console.log('Fill Repo row 11847 col 3:', JSON.stringify(fillR));
}

checkDiffs().catch(err => console.error(err));
