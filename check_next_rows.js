const ExcelJS = require('exceljs');
const fs = require('fs');

const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';

async function checkNextRows() {
  const tempPath = 'temp_next.xlsx';
  fs.copyFileSync(filePath, tempPath);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(tempPath);
  const ws = wb.worksheets[0];
  
  console.log('--- ROWS 1180 TO 1195 ---');
  for (let r = 1180; r <= 1195; r++) {
    const row = ws.getRow(r);
    const no = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const status = row.getCell(4).value;
    const type = row.getCell(5).value;
    const brno = row.getCell(6).value;
    const ind = row.getCell(8).value;
    const addr = row.getCell(9).value;
    const phone = row.getCell(10).value;
    const fontColor = row.getCell(10).font?.color?.argb;
    console.log(`Row ${r} (연번 ${no}): [${name}] 대표:${ceo} | 사번:${brno} | 폰:${phone} (Font:${fontColor})`);
  }
  
  fs.unlinkSync(tempPath);
}

checkNextRows().catch(e => console.error(e));
