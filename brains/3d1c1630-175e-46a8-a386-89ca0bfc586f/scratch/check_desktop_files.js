const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function checkDesktopFiles() {
  const currentPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const finalUpdatedPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';
  const corpPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_법인번호.xlsx';

  console.log('Checking Desktop files...');
  const wbCurrent = new ExcelJS.Workbook();
  await wbCurrent.xlsx.readFile(currentPath);
  const wsCurrent = wbCurrent.getWorksheet('기업 정보');

  const wbFinal = new ExcelJS.Workbook();
  await wbFinal.xlsx.readFile(finalUpdatedPath);
  const wsFinal = wbFinal.getWorksheet('기업 정보');

  const wbCorp = new ExcelJS.Workbook();
  await wbCorp.xlsx.readFile(corpPath);
  const wsCorp = wbCorp.getWorksheet('기업 정보');

  console.log(`wsCurrent: ${wsCurrent.rowCount} rows`);
  console.log(`wsFinal: ${wsFinal.rowCount} rows`);
  console.log(`wsCorp: ${wsCorp.rowCount} rows`);

  // Compare row 11847 in all three
  console.log('Row 11847 current:', wsCurrent.getRow(11847).getCell(7).value);
  console.log('Row 11847 final:', wsFinal.getRow(11847).getCell(7).value);
  console.log('Row 11847 corp:', wsCorp.getRow(11847).getCell(7).value);

  // Compare diffs between current and final for 11847-12346
  let diffCountFinal = 0;
  for (let r = 11847; r <= 12346; r++) {
    for (let c = 1; c <= 58; c++) {
      const vC = wsCurrent.getRow(r).getCell(c).value;
      const vF = wsFinal.getRow(r).getCell(c).value;
      const sC = (vC === null || vC === undefined) ? '' : String(vC).trim();
      const sF = (vF === null || vF === undefined) ? '' : String(vF).trim();
      if (sC !== sF) diffCountFinal++;
    }
  }
  console.log(`Diffs between current and final in 11847-12346: ${diffCountFinal}`);

  // Compare diffs between current and corp for all rows
  let diffCountCorp = 0;
  const corpDiffs = [];
  for (let r = 2; r <= 12347; r++) {
    for (let c = 1; c <= 58; c++) {
      const vC = wsCurrent.getRow(r).getCell(c).value;
      const vCorp = wsCorp.getRow(r).getCell(c).value;
      const sC = (vC === null || vC === undefined) ? '' : String(vC).trim();
      const sCorp = (vCorp === null || vCorp === undefined) ? '' : String(vCorp).trim();
      if (sC !== sCorp) {
        diffCountCorp++;
        if (corpDiffs.length < 15) {
          corpDiffs.push({ row: r, col: c, colName: wsCurrent.getRow(1).getCell(c).value, current: sC, corp: sCorp });
        }
      }
    }
  }
  console.log(`Diffs between current and corp across all rows: ${diffCountCorp}`);
  if (corpDiffs.length > 0) {
    console.log('Sample diffs between current and corp:', JSON.stringify(corpDiffs, null, 2));
  }
}

checkDesktopFiles().catch(err => console.error(err));
