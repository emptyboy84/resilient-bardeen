const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/validate_db_final_check/node_modules/exceljs');

async function findAllBaeRanges() {
  const wb = new ExcelJS.Workbook();
  const filePath = 'C:/Users/lg/Desktop/오늘/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
  console.log('Loading workbook...');
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업 정보');
  
  const baeRows = [];
  for (let r = 2; r <= 15000; r++) {
    const val = ws.getRow(r).getCell(1).value;
    if (val && String(val).includes('배현명')) {
      baeRows.push(r);
    }
  }
  
  console.log(`Total 배현명 rows found in 2..15000: ${baeRows.length}`);
  // Find continuous intervals
  const intervals = [];
  let start = baeRows[0];
  let prev = baeRows[0];
  for (let i = 1; i < baeRows.length; i++) {
    if (baeRows[i] === prev + 1) {
      prev = baeRows[i];
    } else {
      intervals.push({ start, end: prev, count: prev - start + 1 });
      start = baeRows[i];
      prev = baeRows[i];
    }
  }
  if (start !== undefined) {
    intervals.push({ start, end: prev, count: prev - start + 1 });
  }
  console.log('배현명 intervals:', JSON.stringify(intervals, null, 2));

  // Check what is in the first interval vs the second interval
  intervals.forEach(inv => {
    console.log(`\nInterval ${inv.start} ~ ${inv.end} (${inv.count} rows):`);
    console.log(`Start row (${inv.start}):`, JSON.stringify(ws.getRow(inv.start).values.slice(1, 10)));
    console.log(`End row (${inv.end}):`, JSON.stringify(ws.getRow(inv.end).values.slice(1, 10)));
  });
}

findAllBaeRanges().catch(err => console.error(err));
