const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');

async function checkRows() {
  const file1 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file1);
  const ws = wb.worksheets[0];

  console.log('Checking seq 1 to 300 in target file:');
  const emptySeqs = [];
  const filledSeqs = [];
  for (let r = 2; r <= ws.rowCount; r++) {
    const seq = ws.getRow(r).getCell(1).value;
    if (seq <= 300) {
      const phone = ws.getRow(r).getCell(10).value;
      if (!phone || String(phone).trim() === '') {
        emptySeqs.push({ r, seq, name: ws.getRow(r).getCell(2).value });
      } else {
        filledSeqs.push(seq);
      }
    }
  }
  console.log('Total filled in seq 1-300:', filledSeqs.length);
  console.log('Empty in seq 1-300 count:', emptySeqs.length);
  console.log('Empty in seq 1-300 details:', JSON.stringify(emptySeqs, null, 2));
}

checkRows().catch(console.error);
