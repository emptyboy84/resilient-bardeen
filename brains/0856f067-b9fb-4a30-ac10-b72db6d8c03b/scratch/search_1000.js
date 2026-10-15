const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_goejeong_manhwa_data/node_modules/exceljs');

async function searchCompletedDb() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx');
  const sheet = wb.getWorksheet(1);
  console.log(`Sheet name: ${sheet.name}, rows: ${sheet.rowCount}`);
  let found = 0;
  sheet.eachRow((row, rowNumber) => {
    const text = row.values.join(' | ');
    if (text.includes('괴정') || text.includes('만화') || text.includes('티앤북스') || text.includes('206-3991') || text.includes('성현')) {
      console.log(`Row ${rowNumber}:`, text);
      found++;
    }
  });
  console.log(`Total found: ${found}`);
}

searchCompletedDb().catch(console.error);
