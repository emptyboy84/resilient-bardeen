const ExcelJS = require('exceljs');

async function inspectUserExcel() {
  const filePath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  
  console.log('Worksheets:', wb.worksheets.map(w => w.name));
  const ws = wb.worksheets[0];
  console.log('Total rows:', ws.rowCount, 'Total cols:', ws.columnCount);

  // Check header
  const header = ws.getRow(1).values;
  console.log('Header:', header);

  // Find rows with red fill or red font
  const redRows = [];
  const rowsWithPhone = [];
  
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    let isRed = false;
    let redDetail = '';

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // check font color
      if (cell.font && cell.font.color) {
        const argb = cell.font.color.argb;
        if (argb && (argb.includes('FF0000') || argb.includes('ff0000') || argb === 'FFFF0000')) {
          isRed = true;
          redDetail = `font red col ${colNumber}`;
        }
      }
      // check fill color
      if (cell.fill && cell.fill.fgColor) {
        const argb = cell.fill.fgColor.argb;
        if (argb && (argb.includes('FF0000') || argb.includes('ff0000') || argb.includes('FFC7CE') || argb.includes('FF9999'))) {
          isRed = true;
          redDetail = `fill red col ${colNumber} (${argb})`;
        }
      }
    });

    const phoneVal = row.getCell(10).value; // col 10 is usually phone
    if (phoneVal) {
      rowsWithPhone.push({ rowNumber, phone: phoneVal });
    }

    if (isRed) {
      redRows.push({ rowNumber, redDetail, values: row.values.slice(1, 12) });
    }
  });

  console.log(`\nTotal rows with phone: ${rowsWithPhone.length}`);
  console.log(`Total RED rows found: ${redRows.length}`);
  if (redRows.length > 0) {
    console.log('Sample RED rows (first 5):', redRows.slice(0, 5));
    console.log('Sample RED rows (last 10):', redRows.slice(-10));
  } else {
    // If no ARGB red matched, let's inspect the bottom 30 rows directly
    console.log('\nInspecting bottom 30 rows styles and values:');
    for (let r = Math.max(2, ws.rowCount - 30); r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const cellStyles = [];
      row.eachCell((cell, col) => {
        if (cell.font?.color || cell.fill?.fgColor) {
          cellStyles.push({ col, font: cell.font?.color, fill: cell.fill?.fgColor });
        }
      });
      console.log(`Row ${r}:`, row.values.slice(1, 11), cellStyles.length > 0 ? cellStyles : '');
    }
  }
}

inspectUserExcel().catch(err => console.error('Error:', err));
