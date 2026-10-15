const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function auditFinal() {
  const currentPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const finalUpdatedPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';

  const wbC = new ExcelJS.Workbook();
  await wbC.xlsx.readFile(currentPath);
  const wsC = wbC.getWorksheet('기업 정보');

  const wbF = new ExcelJS.Workbook();
  await wbF.xlsx.readFile(finalUpdatedPath);
  const wsF = wbF.getWorksheet('기업 정보');

  // Let's check cell fill colors across 11847..12346 in currentPath vs finalUpdatedPath
  let orangeCountC = 0;
  let orangeCountF = 0;
  for (let r = 11847; r <= 12346; r++) {
    const rowC = wsC.getRow(r);
    const rowF = wsF.getRow(r);
    for (let c = 1; c <= 58; c++) {
      const fC = rowC.getCell(c).fill;
      const fF = rowF.getCell(c).fill;
      if (fC && fC.type === 'pattern' && fC.fgColor && (fC.fgColor.argb === 'FFFFA500' || fC.fgColor.theme === null && fC.fgColor.argb)) {
        orangeCountC++;
      }
      if (fF && fF.type === 'pattern' && fF.fgColor && (fF.fgColor.argb === 'FFFFA500' || (fF.fgColor.argb && fF.fgColor.argb.includes('A500')))) {
        orangeCountF++;
      }
    }
  }

  console.log(`Orange cells in 11847-12346 -> currentPath: ${orangeCountC}, finalUpdatedPath: ${orangeCountF}`);

  // Let's check rows 702 to 5500 orange cells in currentPath vs finalUpdatedPath
  let orangeCountC_702 = 0;
  let orangeCountF_702 = 0;
  for (let r = 702; r <= 5500; r++) {
    const rowC = wsC.getRow(r);
    const rowF = wsF.getRow(r);
    const val = rowC.getCell(1).value;
    if (val && String(val).includes('배현명')) {
      for (let c = 1; c <= 58; c++) {
        const fC = rowC.getCell(c).fill;
        const fF = rowF.getCell(c).fill;
        if (fC && fC.type === 'pattern' && fC.fgColor && (fC.fgColor.argb === 'FFFFA500' || (fC.fgColor.argb && fC.fgColor.argb.includes('A500')))) {
          orangeCountC_702++;
        }
        if (fF && fF.type === 'pattern' && fF.fgColor && (fF.fgColor.argb === 'FFFFA500' || (fF.fgColor.argb && fF.fgColor.argb.includes('A500')))) {
          orangeCountF_702++;
        }
      }
    }
  }
  console.log(`Orange cells in 702-5500 -> currentPath: ${orangeCountC_702}, finalUpdatedPath: ${orangeCountF_702}`);
}

auditFinal().catch(err => console.error(err));
