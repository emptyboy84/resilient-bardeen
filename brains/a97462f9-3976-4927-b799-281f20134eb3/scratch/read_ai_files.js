const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');
const path = require('path');

const files = ['인공지능으로찾은거.xlsx', '인공지능으로찾을거.xlsx'];

async function readRows() {
  for (const f of files) {
    console.log(`\n=== Reading ${f} ===`);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(path.join('C:\\Users\\lg\\Desktop\\Today', f));
    const sheet = wb.worksheets[0];
    const header = sheet.getRow(1).values;
    console.log('Header:', header);

    sheet.eachRow((row, rowNumber) => {
      const vals = row.values;
      const str = JSON.stringify(vals);
      if (str && (str.includes('동화사') || str.includes('464-0761'))) {
        console.log(`Row ${rowNumber}:`, vals);
      }
    });
  }
}

readRows();
