const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

function parseFullCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField);
      if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
  }
  return rows;
}

async function compareCsvWithExcel() {
  const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
  const xlsxPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const csvClean = csvContent.charCodeAt(0) === 0xFEFF ? csvContent.slice(1) : csvContent;
  const csvRows = parseFullCSV(csvClean);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);
  const ws = wb.getWorksheet('기업체 리스트');

  console.log(`CSV rows: ${csvRows.length}, Excel rows: ${ws.rowCount}`);

  const differences = [];

  for (let r = 2; r <= Math.max(csvRows.length, ws.rowCount); r++) {
    const cRow = csvRows[r - 1] || [];
    const xRow = ws.getRow(r);

    // Compare cols 1 to 18 (0 to 17 in 0-indexed)
    for (let c = 1; c <= 18; c++) {
      let cVal = cRow[c - 1] !== undefined ? String(cRow[c - 1]).trim() : '';
      let xCellVal = xRow.getCell(c).value;
      if (xCellVal === null || xCellVal === undefined) xCellVal = '';
      let xVal = String(xCellVal).trim();

      // Normalize numbers (e.g. 13500000000 vs 13,500,000,000)
      const cNorm = cVal.replace(/,/g, '');
      const xNorm = xVal.replace(/,/g, '');

      if (cVal !== xVal && cNorm !== xNorm) {
        differences.push({
          row: r,
          col: c,
          colName: csvRows[0][c - 1],
          compName: cRow[2] || xRow.getCell(3).value,
          csvVal: cVal,
          excelVal: xVal
        });
      }
    }
  }

  console.log(`Total cell differences found between CSV and Excel: ${differences.length}`);
  console.log('Sample 30 differences:');
  differences.slice(0, 30).forEach(d => {
    console.log(`Row ${d.row} [${d.compName}] Col ${d.col} (${d.colName}): CSV="${d.csvVal}" | Excel="${d.excelVal}"`);
  });
}

compareCsvWithExcel().catch(console.error);
