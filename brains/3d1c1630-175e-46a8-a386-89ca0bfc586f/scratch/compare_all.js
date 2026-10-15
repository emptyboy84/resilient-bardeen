const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function compareAll() {
  const desktopPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const repoPath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';

  console.log('Loading workbooks...');
  const wbDesktop = new ExcelJS.Workbook();
  await wbDesktop.xlsx.readFile(desktopPath);
  const wsDesktop = wbDesktop.getWorksheet('기업 정보');

  const wbRepo = new ExcelJS.Workbook();
  await wbRepo.xlsx.readFile(repoPath);
  const wsRepo = wbRepo.getWorksheet('기업 정보');

  // Let's check max row that has any data in Desktop
  let maxRow = 0;
  for (let r = 1; r <= 25000; r++) {
    const row = wsDesktop.getRow(r);
    let hasData = false;
    for (let c = 1; c <= 58; c++) {
      if (row.getCell(c).value !== null && row.getCell(c).value !== undefined && row.getCell(c).value !== '') {
        hasData = true;
        break;
      }
    }
    if (hasData) {
      maxRow = r;
    }
  }
  console.log(`Actual max row with data in Desktop: ${maxRow}`);

  let diffCount = 0;
  const diffList = [];
  for (let r = 1; r <= maxRow; r++) {
    const rowD = wsDesktop.getRow(r);
    const rowR = wsRepo.getRow(r);
    for (let c = 1; c <= 58; c++) {
      const vD = rowD.getCell(c).value;
      const vR = rowR.getCell(c).value;
      const sD = (vD === null || vD === undefined) ? '' : String(vD).trim();
      const sR = (vR === null || vR === undefined) ? '' : String(vR).trim();
      if (sD !== sR) {
        diffCount++;
        if (diffList.length < 30) {
          diffList.push({ row: r, col: c, desktop: sD, repo: sR });
        }
      }
    }
  }

  console.log(`Total cell diffs across all rows (1..${maxRow}): ${diffCount}`);
  if (diffList.length > 0) {
    console.log('Sample diffs:', JSON.stringify(diffList, null, 2));
  }
}

compareAll().catch(err => console.error(err));
