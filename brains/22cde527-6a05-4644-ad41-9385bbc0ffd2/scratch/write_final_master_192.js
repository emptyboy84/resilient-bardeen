const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';

const masterList = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'master_verified_194.json'), 'utf8'));
const masterMap = {};
for (const item of masterList) {
  masterMap[item.rowNumber] = item;
}

const redBoldFont = {
  name: '맑은 고딕',
  size: 10,
  color: { argb: 'FFFF0000' },
  bold: true
};

async function updateFiles() {
  console.log('Loading Excel file...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(targetXlsxPath);
  const ws = wb.worksheets[0];
  
  // Ensure header
  const headerRow = ws.getRow(1);
  headerRow.getCell(2).value = '기존행번호';
  headerRow.getCell(19).value = '데이터 출처';
  
  let filledRowsCount = 0;
  let filledCellsCount = 0;
  
  // Iterate all rows
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    
    // Always set 기존행번호 to r
    row.getCell(2).value = r;
    
    const verified = masterMap[r];
    if (verified) {
      filledRowsCount++;
      
      // Helper to set red bold value
      function setRed(colIdx, val) {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const cell = row.getCell(colIdx);
          cell.value = String(val).trim();
          cell.font = redBoldFont;
          filledCellsCount++;
        }
      }
      
      // Col 4: 사업자번호
      setRed(4, verified.bizno);
      
      // Col 5: 설립연도(연도)
      if (!row.getCell(5).value && verified.year) setRed(5, verified.year);
      
      // Col 6: 설립연도(월)
      if (!row.getCell(6).value && verified.month) setRed(6, verified.month);
      
      // Col 7: 대표자 성함
      if (!row.getCell(7).value && verified.ceo) setRed(7, verified.ceo);
      
      // Col 8: 연락처
      if (!row.getCell(8).value && verified.tel) setRed(8, verified.tel);
      
      // Col 9: 팩스번호
      if (!row.getCell(9).value && verified.fax) setRed(9, verified.fax);
      
      // Col 14: 폐업 날짜
      if (!row.getCell(14).value && verified.closeDate) setRed(14, verified.closeDate);
      
      // Col 15: 비고
      if (!row.getCell(15).value && verified.status === '폐업자') setRed(15, '폐업');
      
      // Col 16: 종사자수(명) 25년 기준
      if (!row.getCell(16).value && verified.emp) setRed(16, verified.emp);
      
      // Col 17: 24년 매출액(원)
      if (r === 2307 && !row.getCell(17).value) {
        // 피커스튜디오 saramin (NICE평가정보) 192만원
        setRed(17, '1,920,000');
      }
      
      // Col 19: 데이터 출처
      setRed(19, verified.source);
    }
  }
  
  // Set freeze pane on row 1
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];
  
  // Set auto filter
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 19 }
  };
  
  console.log(`Updated ${filledRowsCount} rows with ${filledCellsCount} red bold cells.`);
  
  // Save Excel
  try {
    await wb.xlsx.writeFile(targetXlsxPath);
    console.log('Saved updated Excel to:', targetXlsxPath);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const fallbackPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx';
      console.log('Warning: Original Excel is currently open in Excel application! Saving to fallback:', fallbackPath);
      await wb.xlsx.writeFile(fallbackPath);
      console.log('Successfully saved to fallback:', fallbackPath);
    } else {
      throw err;
    }
  }
  
  // Save CSV (UTF-8 BOM)
  const csvRows = [];
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const rowVals = [];
    for (let c = 1; c <= 19; c++) {
      let v = row.getCell(c).value;
      if (v === null || v === undefined) v = '';
      else v = String(v).trim();
      
      if (v.includes(',') || v.includes('"') || v.includes('\n')) {
        v = `"${v.replace(/"/g, '""')}"`;
      }
      rowVals.push(v);
    }
    csvRows.push(rowVals.join(','));
  }
  
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  try {
    fs.writeFileSync(targetCsvPath, csvContent, 'utf8');
    console.log('Saved updated CSV to:', targetCsvPath);
  } catch (err) {
    if (err.code === 'EBUSY') {
      const fallbackCsv = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.csv';
      fs.writeFileSync(fallbackCsv, csvContent, 'utf8');
      console.log('Saved fallback CSV to:', fallbackCsv);
    } else {
      throw err;
    }
  }
}

updateFiles();
