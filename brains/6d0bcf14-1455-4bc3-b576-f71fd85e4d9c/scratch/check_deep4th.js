const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');

async function checkDeep4th() {
  const file1 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const file2 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';
  
  const wb1 = new ExcelJS.Workbook();
  await wb1.xlsx.readFile(file1);
  const ws1 = wb1.worksheets[0];

  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(file2);
  const ws2 = wb2.worksheets[0];

  const emptyInWs1 = [];
  for (let r = 2; r <= ws1.rowCount; r++) {
    const seq = ws1.getRow(r).getCell(1).value;
    const p1 = ws1.getRow(r).getCell(10).value;
    if (!p1 || String(p1).trim() === '') {
      const p2 = ws2.getRow(r).getCell(10).value;
      const name = ws1.getRow(r).getCell(2).value;
      const bizNo = ws1.getRow(r).getCell(6).value;
      emptyInWs1.push({ r, seq, name, bizNo, ws2_phone: p2 });
    }
  }

  console.log(`Total empty in ws1 across entire file: ${emptyInWs1.length}`);
  console.log(`Of those, how many have a phone in ws2 (심층4차)?`, emptyInWs1.filter(x => x.ws2_phone && String(x.ws2_phone).trim() !== '').length);
  
  console.log('--- Empty in ws1 with seq <= 300: ---');
  emptyInWs1.filter(x => x.seq <= 300).forEach(x => {
    console.log(`Seq ${x.seq} (R${x.r}): ${x.name} (${x.bizNo}) => ws2_phone: ${x.ws2_phone}`);
  });
}

checkDeep4th().catch(console.error);
