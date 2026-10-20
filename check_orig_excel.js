const ExcelJS = require('exceljs');

async function check() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달 (1).xlsx');
  const ws = wb.worksheets[0];
  ws.eachRow((row, r) => {
    for (let c = 1; c <= 17; c++) {
      const v = String(row.getCell(c).value || '');
      if (v.includes('9226-2309') || v.includes('92262309')) {
        console.log(`Found exact in Row ${r} Col ${c}: ${v}`);
        console.log('Row values:', row.values);
      }
    }
  });
}

check();
