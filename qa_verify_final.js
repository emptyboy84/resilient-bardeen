const fs = require('fs');
const ExcelJS = require('exceljs');

async function qaVerifyFinal() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const txtPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';

  console.log(`=== 1. Inspecting User Excel File ===`);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  console.log(`Sheet name: ${ws.name}`);
  console.log(`Total rows: ${ws.rowCount}`);
  console.log(`Total columns: ${ws.columnCount}`);

  let totalFilled = 0;
  let redFilled = 0;
  let emptyCount = 0;
  let count051 = 0;
  let count070 = 0;
  let count02 = 0;
  let countRep = 0; // 15xx, 16xx, 18xx
  let count0507 = 0;
  let countMobile = 0;
  let countMasked = 0;
  let falseCSCount = 0;

  const STRICT_PORTAL_CS_BLACKLIST = new Set([
    '02-6226-5000', '02-6937-0035', '02-6937-0039',
    '02-3771-1514', '1588-9356', '1588-3333',
    '1577-0000', '02-1577-0000', '02-2008-8888'
  ]);

  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const p = row.getCell(10).value;
    if (p) {
      totalFilled++;
      const pStr = String(p).trim();
      const isRed = row.getCell(10).font?.color?.argb === 'FFFF0000';
      if (isRed) redFilled++;

      if (STRICT_PORTAL_CS_BLACKLIST.has(pStr)) falseCSCount++;

      if (pStr.startsWith('051-')) count051++;
      else if (pStr.startsWith('070-')) count070++;
      else if (pStr.startsWith('02-')) count02++;
      else if (/^(?:15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$/.test(pStr)) countRep++;
      else if (pStr.startsWith('0507-') || pStr.startsWith('050-')) count0507++;
      else if (pStr.includes('*')) countMasked++;
      else if (pStr.startsWith('010-')) countMobile++;
    } else {
      emptyCount++;
    }
  }

  console.log(`\n=== Excel Statistics ===`);
  console.log(`Total data rows: ${ws.rowCount - 1}`);
  console.log(`Total phone numbers filled: ${totalFilled} (${((totalFilled / (ws.rowCount - 1)) * 100).toFixed(1)}%)`);
  console.log(`  - 051 Busan Landlines: ${count051}`);
  console.log(`  - 070 VoIP Lines: ${count070}`);
  console.log(`  - 02 Seoul / Metro Lines: ${count02}`);
  console.log(`  - 15xx / 16xx / 18xx National Corporate Rep: ${countRep}`);
  console.log(`  - 0507 Smartcall Lines: ${count0507}`);
  console.log(`  - 010 Full Mobiles: ${countMobile}`);
  console.log(`  - 010 Masked Mobiles: ${countMasked}`);
  console.log(`Remaining missing / empty: ${emptyCount}`);
  console.log(`Total RED font phones: ${redFilled}`);
  console.log(`False-positive CS numbers found: ${falseCSCount} (0 expected)`);

  console.log(`\n=== 2. Inspecting Master TXT File ===`);
  const txtContent = fs.readFileSync(txtPath, 'utf8');
  const lines = txtContent.split('\n');
  console.log(`TXT lines count: ${lines.length}`);
  let colMismatch = 0;
  lines.forEach((l, idx) => {
    if (!l.trim()) return;
    const cols = l.split('\t');
    if (cols.length !== 17) colMismatch++;
  });
  console.log(`TXT 17-column format mismatches: ${colMismatch} (0 expected)`);
}

qaVerifyFinal().catch(e => console.error('Error:', e));
