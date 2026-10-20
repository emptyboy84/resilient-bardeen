const ExcelJS = require('exceljs');
const fs = require('fs');

async function analyze() {
  const filePath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달 (1).xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  let totalData = 0;
  let hasPhone = 0;
  let missingPhone = [];

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Header
    totalData++;
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const status = row.getCell(4).value;
    const type = row.getCell(5).value;
    const bizNo = String(row.getCell(6).value || '');
    const corpNo = String(row.getCell(7).value || '');
    const industry = row.getCell(8).value;
    const address = row.getCell(9).value;
    const phone = String(row.getCell(10).value || '').trim();

    if (phone) {
      hasPhone++;
    } else {
      missingPhone.push({
        rowNum: rowNumber,
        seq: seq,
        name: name,
        ceo: ceo,
        status: status,
        type: type,
        bizNo: bizNo,
        corpNo: corpNo,
        industry: industry,
        address: address
      });
    }
  });

  console.log('Total companies:', totalData);
  console.log('Already have phone:', hasPhone);
  console.log('Missing phone:', missingPhone.length);

  fs.writeFileSync('cretap_missing_phone_targets.json', JSON.stringify(missingPhone, null, 2), 'utf8');
}
analyze();
