const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function search() {
  const workbook = new ExcelJS.Workbook();
  console.log('Loading workbook...');
  await workbook.xlsx.readFile('./data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
  console.log('Workbook loaded. Sheet count:', workbook.worksheets.length);
  for (const sheet of workbook.worksheets) {
    console.log('Searching in sheet:', sheet.name, 'row count:', sheet.rowCount);
    sheet.eachRow((row, rowNumber) => {
      const rowValues = row.values;
      const str = JSON.stringify(rowValues);
      if (str.includes('운도') || str.includes('김도현') || str.includes('7733-6343') || str.includes('77336343')) {
        console.log('Found in ' + sheet.name + ' at row ' + rowNumber + ':', rowValues);
      }
    });
  }
}

search().catch(err => console.error(err));
