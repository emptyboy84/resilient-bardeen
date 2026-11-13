const ExcelJS = require('exceljs');
const fs = require('fs');

async function run() {
  const filePath = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];
  const list = [];
  ws.eachRow((row, r) => {
    if (r === 1) return;
    const seq = row.getCell(1).value;
    const name = row.getCell(2).value;
    const ceo = row.getCell(3).value;
    const status = row.getCell(4).value;
    const bno = row.getCell(6).value;
    const addr = row.getCell(9).value;
    const tel = row.getCell(10).value;
    if (seq >= 1001 && seq <= 1300 && !tel && status !== '폐업') {
      list.push({ r, seq, name: String(name||'').trim(), ceo: String(ceo||'').trim(), bno: String(bno||'').trim(), addr: String(addr||'').trim() });
    }
  });
  console.log('Count in 1001-1300:', list.length);
  fs.writeFileSync('active_1001_1300.json', JSON.stringify(list, null, 2), 'utf8');
  list.slice(0, 25).forEach((item, idx) => {
    console.log(`[${idx+1}] Seq ${item.seq} (Row ${item.r}) | ${item.name} | 대표: ${item.ceo} | 사번: ${item.bno} | ${item.addr.slice(0, 35)}`);
  });
}
run();
