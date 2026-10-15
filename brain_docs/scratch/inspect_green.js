const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_busan_phone_numbers\\node_modules\\exceljs');

async function inspectGreenFills() {
  const files = [
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사_심층4차.xlsx',
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx',
    'C:\\Users\\lg\\Desktop\\Today\\부산기업_전화번호검증_완료본_20261014.xlsx'
  ];

  for (const f of files) {
    console.log(`\n=== Inspecting: ${f} ===`);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(f);
    const ws = wb.worksheets[0];

    let greenCount = 0;
    const sampleGreenCells = [];

    for (let r = 1; r <= Math.min(ws.rowCount, 300); r++) {
      const row = ws.getRow(r);
      for (let c = 1; c <= ws.columnCount; c++) {
        const cell = row.getCell(c);
        if (cell.fill && cell.fill.type === 'pattern' && cell.fill.fgColor) {
          const color = cell.fill.fgColor.argb || cell.fill.fgColor.theme || JSON.stringify(cell.fill.fgColor);
          if (sampleGreenCells.length < 10) {
            sampleGreenCells.push({ r, c, val: cell.value, fill: cell.fill });
          }
          greenCount++;
        }
      }
    }
    console.log(`Rows 1-300: filled cells count = ${greenCount}`);
    console.log('Sample filled cells:', JSON.stringify(sampleGreenCells, null, 2));
  }
}

inspectGreenFills().catch(console.error);
