const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function checkDiffCategories() {
  const currentPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const finalUpdatedPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';

  const wbC = new ExcelJS.Workbook();
  await wbC.xlsx.readFile(currentPath);
  const wsC = wbC.getWorksheet('기업 정보');

  const wbF = new ExcelJS.Workbook();
  await wbF.xlsx.readFile(finalUpdatedPath);
  const wsF = wbF.getWorksheet('기업 정보');

  const diffCols = {};
  const diffSampleByCol = {};

  for (let r = 11847; r <= 12346; r++) {
    for (let c = 1; c <= 58; c++) {
      const vC = wsC.getRow(r).getCell(c).value;
      const vF = wsF.getRow(r).getCell(c).value;
      const sC = (vC === null || vC === undefined) ? '' : (typeof vC === 'object' ? (vC.text || '') : String(vC)).trim();
      const sF = (vF === null || vF === undefined) ? '' : (typeof vF === 'object' ? (vF.text || '') : String(vF)).trim();
      if (sC !== sF) {
        const colName = `Col ${c} (${wsC.getRow(1).getCell(c).value})`;
        diffCols[colName] = (diffCols[colName] || 0) + 1;
        if (!diffSampleByCol[colName]) {
          diffSampleByCol[colName] = [];
        }
        if (diffSampleByCol[colName].length < 5) {
          diffSampleByCol[colName].push({
            row: r,
            company: wsC.getRow(r).getCell(3).value,
            current: sC,
            final: sF
          });
        }
      }
    }
  }

  console.log('Diff counts by column:');
  console.log(JSON.stringify(diffCols, null, 2));
  console.log('\nDiff samples by column:');
  console.log(JSON.stringify(diffSampleByCol, null, 2));
}

checkDiffCategories().catch(err => console.error(err));
