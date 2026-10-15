const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function checkOtherAssignees() {
  const currentPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  const finalUpdatedPath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_최종본_수정완료.xlsx';

  const wbCurrent = new ExcelJS.Workbook();
  await wbCurrent.xlsx.readFile(currentPath);
  const wsCurrent = wbCurrent.getWorksheet('기업 정보');

  const wbFinal = new ExcelJS.Workbook();
  await wbFinal.xlsx.readFile(finalUpdatedPath);
  const wsFinal = wbFinal.getWorksheet('기업 정보');

  let nonBaeDiffs = 0;
  const nonBaeDiffList = [];

  for (let r = 2; r <= 20434; r++) {
    const assigneeC = wsCurrent.getRow(r).getCell(1).value;
    const assigneeF = wsFinal.getRow(r).getCell(1).value;
    const isBae = (assigneeC && String(assigneeC).includes('배현명')) || (assigneeF && String(assigneeF).includes('배현명'));

    if (!isBae) {
      for (let c = 1; c <= 58; c++) {
        const vC = wsCurrent.getRow(r).getCell(c).value;
        const vF = wsFinal.getRow(r).getCell(c).value;
        const sC = (vC === null || vC === undefined) ? '' : String(vC).trim();
        const sF = (vF === null || vF === undefined) ? '' : String(vF).trim();
        if (sC !== sF) {
          nonBaeDiffs++;
          if (nonBaeDiffList.length < 20) {
            nonBaeDiffList.push({ row: r, assignee: assigneeC, col: c, current: sC, final: sF });
          }
        }
      }
    }
  }

  console.log(`Diffs in Non-배현명 rows: ${nonBaeDiffs}`);
  if (nonBaeDiffList.length > 0) {
    console.log('Sample non-bae diffs:', JSON.stringify(nonBaeDiffList, null, 2));
  }
}

checkOtherAssignees().catch(err => console.error(err));
