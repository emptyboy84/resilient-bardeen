const ExcelJS = require('exceljs');
const path = require('path');

async function searchExcel(filePath, term) {
  console.log(`Checking ${path.basename(filePath)} for "${term}"...`);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  workbook.eachSheet((worksheet, sheetId) => {
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        const val = cell.text || (cell.value ? cell.value.toString() : '');
        if (val && val.includes(term)) {
          console.log(`Found in [${worksheet.name}] Row ${rowNumber}, Col ${colNumber}: ${val}`);
          console.log(`Full row ${rowNumber}:`, row.values);
        }
      });
    });
  });
}

async function main() {
  const files = [
    'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_studio_bio_data/data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx',
    'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_studio_bio_data/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'
  ];

  const terms = ['스튜디오비오', '이한빈', '010-5093-0304', '인디랩'];

  for (const f of files) {
    for (const t of terms) {
      try {
        await searchExcel(f, t);
      } catch (e) {
        console.error(e.message);
      }
    }
  }
}

main();
