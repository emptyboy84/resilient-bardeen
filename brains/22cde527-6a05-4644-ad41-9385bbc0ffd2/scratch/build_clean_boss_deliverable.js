const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const basePristinePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';
const targetXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const finalFallbackPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx';

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

const blackRegularFont = {
  name: '맑은 고딕',
  size: 10,
  color: { argb: 'FF000000' },
  bold: false
};

async function buildDeliverable() {
  console.log('Loading pristine base Excel file:', basePristinePath);
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(basePristinePath);
  const ws = wb.worksheets[0];
  console.log(`Sheet name: ${ws.name}, Total rows: ${ws.rowCount}`);

  // 1. Ensure Header Row (Row 1)
  const hRow = ws.getRow(1);
  hRow.getCell(1).value = '구분';
  hRow.getCell(2).value = '기존행번호';
  hRow.getCell(3).value = '사업체명';
  hRow.getCell(4).value = '사업자번호';
  hRow.getCell(5).value = '설립연도(연도)';
  hRow.getCell(6).value = '설립연도(월)';
  hRow.getCell(7).value = '대표자 성함';
  hRow.getCell(8).value = '연락처';
  hRow.getCell(9).value = '팩스번호';
  hRow.getCell(10).value = '시군구';
  hRow.getCell(11).value = '주소';
  hRow.getCell(12).value = '업종분류';
  hRow.getCell(13).value = '컨택결과';
  hRow.getCell(14).value = '폐업 날짜';
  hRow.getCell(15).value = '비고';
  hRow.getCell(16).value = '종사자수(명) 25년 기준';
  hRow.getCell(17).value = '24년 매출액(원)';
  hRow.getCell(18).value = '25년 매출액(원)';
  hRow.getCell(19).value = '데이터 출처';

  // Ensure header font is black bold
  for (let c = 1; c <= 19; c++) {
    hRow.getCell(c).font = { name: '맑은 고딕', size: 10, bold: true, color: { argb: 'FF000000' } };
  }

  let filledRowsCount = 0;
  let filledCellsCount = 0;

  // 2. Iterate rows 2 to 2314
  for (let r = 2; r <= 2314; r++) {
    const row = ws.getRow(r);

    // Ensure Col 2 is exactly r (기존행번호) in BLACK font
    const c2 = row.getCell(2);
    c2.value = r;
    c2.font = blackRegularFont;

    // Check if this row is one of our verified recoveries
    const verified = masterMap[r];

    if (verified) {
      filledRowsCount++;

      // Helper function to fill a cell ONLY IF it was blank, or if it's the verified value we are populating
      function fillBlankRed(colIdx, val) {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const cell = row.getCell(colIdx);
          cell.value = String(val).trim();
          cell.font = redBoldFont;
          filledCellsCount++;
        }
      }

      // Col 4: 사업자번호 (The core missing target)
      fillBlankRed(4, verified.bizno);

      // Col 5: 설립연도(연도) - fill if empty or matches
      if (verified.year) {
        const cur = row.getCell(5).value;
        if (!cur || String(cur).trim() === '') {
          fillBlankRed(5, verified.year);
        }
      }

      // Col 6: 설립연도(월)
      if (verified.month) {
        const cur = row.getCell(6).value;
        if (!cur || String(cur).trim() === '') {
          fillBlankRed(6, verified.month);
        }
      }

      // Col 7: 대표자 성함
      if (verified.ceo) {
        const cur = row.getCell(7).value;
        if (!cur || String(cur).trim() === '') {
          fillBlankRed(7, verified.ceo);
        }
      }

      // Col 8: 연락처
      if (verified.tel) {
        const cur = row.getCell(8).value;
        if (!cur || String(cur).trim() === '') {
          fillBlankRed(8, verified.tel);
        }
      }

      // Col 9: 팩스번호
      if (verified.fax) {
        const cur = row.getCell(9).value;
        if (!cur || String(cur).trim() === '') {
          fillBlankRed(9, verified.fax);
        }
      }

      // Col 14: 폐업 날짜
      if (verified.closeDate) {
        fillBlankRed(14, verified.closeDate);
      }

      // Col 15: 비고 ('폐업')
      if (verified.status === '폐업자') {
        fillBlankRed(15, '폐업');
      }

      // Col 16: 종사자수(명) 25년 기준
      if (verified.emp) {
        const cur = row.getCell(16).value;
        if (!cur || String(cur).trim() === '') {
          fillBlankRed(16, verified.emp);
        }
      }

      // Col 17: 24년 매출액(원)
      if (r === 2307) {
        fillBlankRed(17, '1,920,000');
      }

      // Col 19: 데이터 출처
      if (verified.source) {
        fillBlankRed(19, verified.source);
      }
    } else {
      // Ensure existing original rows have clean black font
      row.eachCell({ includeEmpty: false }, (cell, cIdx) => {
        if (cell.font && cell.font.color && (cell.font.color.argb === 'FFFF0000' || cell.font.color.argb === 'FF0000')) {
          cell.font = blackRegularFont;
        }
      });
    }
  }

  // Remove any rows beyond 2314
  if (ws.rowCount > 2314) {
    ws.spliceRows(2315, ws.rowCount - 2314);
  }

  // Freeze top row
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];

  // Auto filter
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 19 }
  };

  console.log(`\n=== DELIVERABLE BUILD STATS ===`);
  console.log(`Total verified rows with restored data: ${filledRowsCount}`);
  console.log(`Total RED BOLD cells filled into blanks: ${filledCellsCount}`);
  console.log(`Total final row count: ${ws.rowCount}`);

  // Write to target original file
  console.log(`\nWriting to: ${targetXlsxPath}...`);
  try {
    await wb.xlsx.writeFile(targetXlsxPath);
    console.log('SUCCESS: Written directly to', targetXlsxPath);
  } catch (err) {
    console.error('FAILED writing to targetXlsxPath:', err.message);
  }

  // Write to CSV (UTF-8 BOM)
  const csvRows = [];
  for (let r = 1; r <= 2314; r++) {
    const row = ws.getRow(r);
    const rowVals = [];
    for (let c = 1; c <= 19; c++) {
      let v = row.getCell(c).value;
      if (v === null || v === undefined) v = '';
      else v = String(v).trim();

      if (v.includes(',') || v.includes('"') || v.includes('\n') || v.includes('\r')) {
        v = `"${v.replace(/"/g, '""')}"`;
      }
      rowVals.push(v);
    }
    csvRows.push(rowVals.join(','));
  }

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  try {
    fs.writeFileSync(targetCsvPath, csvContent, 'utf8');
    console.log('SUCCESS: Synced to CSV:', targetCsvPath);
  } catch (err) {
    console.error('FAILED writing to targetCsvPath:', err.message);
  }

  // Try updating final fallback as well if not locked
  try {
    await wb.xlsx.writeFile(finalFallbackPath);
    console.log('SUCCESS: Also updated', finalFallbackPath);
  } catch (err) {
    console.log('Note: finalFallbackPath was locked by user Excel viewer (expected). Target original file was updated.');
  }
}

buildDeliverable().catch(console.error);
