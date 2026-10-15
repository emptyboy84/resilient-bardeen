const fs = require('fs');
const path = require('path');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

// Parse CSV with robust quote handling
function parseCSV(content) {
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

function toCSVLine(fields) {
  return fields.map(f => {
    if (f === null || f === undefined) return '';
    const str = String(f);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

async function updateMasterCSV() {
  const dir = 'C:/Users/lg/Desktop/Today';
  const csvPath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv');

  // Load curated updates
  const masterUpdates = JSON.parse(
    fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/master_curated_updates.json', 'utf8')
  );

  // Load Curated 실사 엑셀 (CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx)
  const curatedExcelPath = path.join(dir, 'CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx');
  const curatedWb = new xlsx.Workbook();
  await curatedWb.xlsx.readFile(curatedExcelPath);
  const curatedWs = curatedWb.worksheets[0];

  const excelCuratedMap = new Map();
  for (let r = 2; r <= curatedWs.rowCount; r++) {
    const row = curatedWs.getRow(r);
    const rowNum = Number(row.getCell(1).value); // Col 1: 행번호
    if (!rowNum || isNaN(rowNum)) continue;

    const realBiz = row.getCell(3).value ? String(row.getCell(3).value).trim() : '';
    const ceo = row.getCell(5).value ? String(row.getCell(5).value).trim() : '';
    const phone = row.getCell(6).value ? String(row.getCell(6).value).trim() : '';
    const emp = row.getCell(9).value ? Number(row.getCell(9).value) : null;
    const s24 = row.getCell(10).value ? Number(row.getCell(10).value) : null;
    const s25 = row.getCell(11).value ? Number(row.getCell(11).value) : null;
    const note = row.getCell(12).value ? String(row.getCell(12).value).trim() : '';
    const source = row.getCell(13).value ? String(row.getCell(13).value).trim() : '';

    excelCuratedMap.set(rowNum, {
      realBiz,
      ceo,
      phone,
      emp,
      s24,
      s25,
      note: note ? (source ? `${note} [출처: ${source}]` : note) : (source ? `[출처: ${source}]` : '')
    });
  }

  console.log(`Loaded ${excelCuratedMap.size} curated entries from CT실태조사 Excel.`);

  // Read existing Master CSV
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const cleanContent = csvContent.charCodeAt(0) === 0xFEFF ? csvContent.slice(1) : csvContent;
  const parsedRows = parseCSV(cleanContent);
  const header = parsedRows[0];
  const dataRows = parsedRows.slice(1);

  console.log(`Master CSV has ${dataRows.length} data rows.`);

  const updateMap = new Map();
  masterUpdates.forEach(u => updateMap.set(u.rowNum, u));

  let updatedCount = 0;
  let clearedCount = 0;

  dataRows.forEach((r, idx) => {
    const rowNum = idx + 2; // Excel row number (1-based, header is 1)

    // First: Clean all dummy/placeholder values across all columns
    for (let c = 0; c < 18; c++) {
      let v = r[c] !== undefined && r[c] !== null ? String(r[c]).trim() : '';
      if (v === '-' || v === '--' || v === '없음' || v === 'null' || v === '[object Object]' || v === '확인불가') {
        r[c] = '';
        clearedCount++;
      }
    }

    // Second: Apply curated Excel updates if present
    if (excelCuratedMap.has(rowNum)) {
      const cur = excelCuratedMap.get(rowNum);
      if (cur.realBiz && cur.realBiz.length >= 10) r[3] = cur.realBiz;
      if (cur.ceo && !r[6]) r[6] = cur.ceo;
      if (cur.phone && !r[7]) r[7] = cur.phone;
      if (cur.emp) r[15] = String(cur.emp);
      if (cur.s24) r[16] = cur.s24.toLocaleString('ko-KR');
      if (cur.s25) r[17] = cur.s25.toLocaleString('ko-KR');
      if (cur.note) {
        r[14] = r[14] ? `${r[14]} / ${cur.note}` : cur.note;
      }
      updatedCount++;
    }

    // Third: Apply master curated updates (highest priority, Moneypin/Catch/DART verified)
    if (updateMap.has(rowNum)) {
      const u = updateMap.get(rowNum);
      if (u.biz) r[3] = u.biz;
      if (u.ceo) r[6] = u.ceo;
      if (u.phone) r[7] = u.phone;
      if (u.addr) r[10] = u.addr;
      if (u.emp) r[15] = String(u.emp);
      if (u.s24) r[16] = u.s24.toLocaleString('ko-KR');
      if (u.s25) r[17] = u.s25.toLocaleString('ko-KR');
      if (u.note) {
        r[14] = r[14] ? `${r[14]} ${u.note}` : u.note;
      }
      updatedCount++;
    }
  });

  console.log(`Updated ${updatedCount} rows with high-certainty curated data.`);
  console.log(`Cleared ${clearedCount} placeholder/dummy cells to clean blanks.`);

  // Write updated CSV back
  const lines = [
    toCSVLine(header),
    ...dataRows.map(r => toCSVLine(r))
  ];
  const finalCSV = '\uFEFF' + lines.join('\r\n') + '\r\n';
  fs.writeFileSync(csvPath, finalCSV, 'utf8');

  console.log(`Master CSV successfully updated at: ${csvPath}`);
}

updateMasterCSV().catch(console.error);
