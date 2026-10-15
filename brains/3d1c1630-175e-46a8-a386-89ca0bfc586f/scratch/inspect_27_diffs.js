const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function inspect27Diffs() {
  const currentPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const corpPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_법인번호.xlsx';

  const wbCurrent = new ExcelJS.Workbook();
  await wbCurrent.xlsx.readFile(currentPath);
  const wsCurrent = wbCurrent.getWorksheet('기업 정보');

  const wbCorp = new ExcelJS.Workbook();
  await wbCorp.xlsx.readFile(corpPath);
  const wsCorp = wbCorp.getWorksheet('기업 정보');

  const allDiffs = [];
  for (let r = 2; r <= 12347; r++) {
    for (let c = 1; c <= 58; c++) {
      const vC = wsCurrent.getRow(r).getCell(c).value;
      const vCorp = wsCorp.getRow(r).getCell(c).value;
      const sC = (vC === null || vC === undefined) ? '' : String(vC).trim();
      const sCorp = (vCorp === null || vCorp === undefined) ? '' : String(vCorp).trim();
      if (sC !== sCorp) {
        allDiffs.push({
          row: r,
          company: wsCurrent.getRow(r).getCell(3).value,
          col: c,
          colName: wsCurrent.getRow(1).getCell(c).value,
          current: sC,
          corp: sCorp
        });
      }
    }
  }

  console.log(`Total diffs: ${allDiffs.length}`);
  console.log(JSON.stringify(allDiffs, null, 2));
}

inspect27Diffs().catch(err => console.error(err));
