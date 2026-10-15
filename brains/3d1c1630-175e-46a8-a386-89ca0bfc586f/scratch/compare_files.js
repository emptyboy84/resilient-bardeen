const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function compareFiles() {
  const desktopPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const repoPath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';

  console.log('Loading Desktop workbook...');
  const wbDesktop = new ExcelJS.Workbook();
  await wbDesktop.xlsx.readFile(desktopPath);
  const wsDesktop = wbDesktop.getWorksheet('기업 정보');

  console.log('Loading Repo workbook...');
  const wbRepo = new ExcelJS.Workbook();
  await wbRepo.xlsx.readFile(repoPath);
  const wsRepo = wbRepo.getWorksheet('기업 정보');

  console.log(`Desktop row count: ${wsDesktop.rowCount}, Repo row count: ${wsRepo.rowCount}`);

  // Compare rows 11847 to 12346
  let diffCount11847 = 0;
  const diffs11847 = [];
  for (let r = 11847; r <= 12346; r++) {
    const rowD = wsDesktop.getRow(r);
    const rowR = wsRepo.getRow(r);
    for (let c = 1; c <= 58; c++) {
      const vD = rowD.getCell(c).value;
      const vR = rowR.getCell(c).value;
      const sD = (vD === null || vD === undefined) ? '' : String(vD).trim();
      const sR = (vR === null || vR === undefined) ? '' : String(vR).trim();
      if (sD !== sR) {
        diffCount11847++;
        if (diffs11847.length < 20) {
          diffs11847.push({ row: r, col: c, desktop: sD, repo: sR });
        }
      }
    }
  }
  console.log(`[Rows 11847-12346] Total cell diffs: ${diffCount11847}`);
  if (diffs11847.length > 0) {
    console.log('Sample diffs in 11847-12346:', JSON.stringify(diffs11847, null, 2));
  }

  // Compare earlier rows (e.g. 702 to 5500)
  let diffCountOther = 0;
  const diffsOther = [];
  const otherRanges = [
    [702, 801], [1001, 1100], [1801, 1900], [2401, 2500], [3301, 3400], [5001, 5500]
  ];
  for (const [start, end] of otherRanges) {
    for (let r = start; r <= end; r++) {
      const rowD = wsDesktop.getRow(r);
      const rowR = wsRepo.getRow(r);
      for (let c = 1; c <= 58; c++) {
        const vD = rowD.getCell(c).value;
        const vR = rowR.getCell(c).value;
        const sD = (vD === null || vD === undefined) ? '' : String(vD).trim();
        const sR = (vR === null || vR === undefined) ? '' : String(vR).trim();
        if (sD !== sR) {
          diffCountOther++;
          if (diffsOther.length < 20) {
            diffsOther.push({ row: r, col: c, desktop: sD, repo: sR });
          }
        }
      }
    }
  }
  console.log(`[Earlier rows 702-5500] Total cell diffs: ${diffCountOther}`);
  if (diffsOther.length > 0) {
    console.log('Sample diffs in earlier rows:', JSON.stringify(diffsOther, null, 2));
  }
}

compareFiles().catch(err => console.error(err));
