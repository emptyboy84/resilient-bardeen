const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');
const fs = require('fs');

async function inspect() {
  const file1 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const file2 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx';
  const file3 = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx';
  const file4 = 'C:\\Users\\lg\\Desktop\\Today\\부산기업_전화번호검증_완료본_20261014.xlsx';

  console.log('Comparing files:');
  console.log('1 (Target):', file1, 'exists:', fs.existsSync(file1));
  console.log('2 (Deep 4th):', file2, 'exists:', fs.existsSync(file2));
  console.log('3 (Verified):', file3, 'exists:', fs.existsSync(file3));
  console.log('4 (1014):', file4, 'exists:', fs.existsSync(file4));

  const wb1 = new ExcelJS.Workbook();
  await wb1.xlsx.readFile(file1);
  const ws1 = wb1.worksheets[0];

  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(file2);
  const ws2 = wb2.worksheets[0];

  console.log('ws1 rowCount:', ws1.rowCount, 'ws2 rowCount:', ws2.rowCount);

  console.log('--- Target file ws1 around row 280-286 ---');
  for (let r = 278; r <= 286; r++) {
    const row1 = ws1.getRow(r);
    console.log(`ws1 R${r}: seq=${row1.getCell(1).value}, name=${row1.getCell(2).value}, biz=${row1.getCell(6).value}, phone=${row1.getCell(10).value}`);
  }

  console.log('--- Deep 4th ws2 around row 280-286 ---');
  for (let r = 278; r <= 286; r++) {
    const row2 = ws2.getRow(r);
    console.log(`ws2 R${r}: seq=${row2.getCell(1).value}, name=${row2.getCell(2).value}, biz=${row2.getCell(6).value}, phone=${row2.getCell(10).value}`);
  }

  // Count empty phones in ws1
  let ws1EmptyCount = 0;
  let ws1Total = 0;
  for (let r = 2; r <= ws1.rowCount; r++) {
    const seq = ws1.getRow(r).getCell(1).value;
    if (seq !== null && seq !== undefined && seq !== '') {
      ws1Total++;
      const p = ws1.getRow(r).getCell(10).value;
      if (!p || String(p).trim() === '') ws1EmptyCount++;
    }
  }
  console.log(`ws1 valid rows: ${ws1Total}, empty phone count: ${ws1EmptyCount}`);

  console.log('--- Checking where phones are filled in ws1 ---');
  let lastFilledSeq = 0;
  for (let r = 2; r <= ws1.rowCount; r++) {
    const seq = ws1.getRow(r).getCell(1).value;
    const phone = ws1.getRow(r).getCell(10).value;
    if (phone && String(phone).trim() !== '') {
      lastFilledSeq = seq;
    }
  }
  console.log('Last filled seq in ws1:', lastFilledSeq);

  console.log('--- Checking rows around seq 270 to 300 in ws1 ---');
  for (let r = 2; r <= ws1.rowCount; r++) {
    const seq = ws1.getRow(r).getCell(1).value;
    if (seq >= 275 && seq <= 300) {
      const p1 = ws1.getRow(r).getCell(10).value;
      const p2 = ws2.getRow(r).getCell(10).value;
      console.log(`Seq ${seq} (Row ${r}): Name=${ws1.getRow(r).getCell(2).value} | ws1_phone=${p1} | ws2_phone=${p2}`);
    }
  }

}

inspect().catch(console.error);
