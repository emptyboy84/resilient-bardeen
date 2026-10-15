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

async function inspectFiles() {
  const basePath = 'C:/Users/lg/Desktop/Today/';
  
  // 1. CSV
  const csvFile = basePath + '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
  const csvContent = fs.readFileSync(csvFile, 'utf8');
  const csvClean = csvContent.charCodeAt(0) === 0xFEFF ? csvContent.slice(1) : csvContent;
  const csvRows = parseFullCSV(csvClean);
  console.log('=== CSV ===');
  console.log(`Rows: ${csvRows.length}, Cols in header: ${csvRows[0].length}`);
  console.log('Header:', csvRows[0]);

  // 2. XLSX 1
  const xlsx1Path = basePath + '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb1 = new ExcelJS.Workbook();
  await wb1.xlsx.readFile(xlsx1Path);
  console.log('\n=== XLSX 1 (배현명.xlsx) ===');
  wb1.worksheets.forEach(ws => {
    console.log(`Sheet: ${ws.name}, Rows: ${ws.rowCount}, Cols: ${ws.columnCount}`);
    console.log('Row 1:', ws.getRow(1).values.slice(1, 20));
  });

  // 3. XLSX 2
  const xlsx2Path = basePath + '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(xlsx2Path);
  console.log('\n=== XLSX 2 (배현명_.xlsx) ===');
  wb2.worksheets.forEach(ws => {
    console.log(`Sheet: ${ws.name}, Rows: ${ws.rowCount}, Cols: ${ws.columnCount}`);
    console.log('Row 1:', ws.getRow(1).values.slice(1, 20));
  });
}

inspectFiles().catch(console.error);
