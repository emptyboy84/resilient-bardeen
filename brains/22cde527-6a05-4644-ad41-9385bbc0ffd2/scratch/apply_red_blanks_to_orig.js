const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const origXlsxPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
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

const blackFont = {
  name: '맑은 고딕',
  size: 10,
  color: { argb: 'FF000000' }
};

async function run() {
  console.log('Reading original Excel file...');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(origXlsxPath);
  const ws = wb.worksheets[0];
  console.log(`Sheet name: ${ws.name}, initial rowCount: ${ws.rowCount}`);

  // Set Header in Row 1
  const hRow = ws.getRow(1);
  hRow.getCell(2).value = '기존행번호';
  hRow.getCell(19).value = '데이터 출처';

  let newlyFilledCells = 0;
  let newlyFilledRows = 0;
  let blackResetCells = 0;

  // Track the original missing rows
  const missingRowsSet = new Set(Object.keys(masterMap).map(Number));

  // Iterate rows 2 to 2314
  for (let r = 2; r <= 2314; r++) {
    const row = ws.getRow(r);
    
    // Set Column 2 (기존행번호)
    row.getCell(2).value = r;
    // ensure Col 2 is not red
    row.getCell(2).font = blackFont;

    const verified = masterMap[r];

    if (verified) {
      newlyFilledRows++;

      // Helper to fill cell in red bold
      function setRedCell(colIdx, val) {
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          const cell = row.getCell(colIdx);
          cell.value = String(val).trim();
          cell.font = redBoldFont;
          newlyFilledCells++;
        }
      }

      // 1. Col 4: 사업자번호
      setRedCell(4, verified.bizno);

      // 2. Col 5: 설립연도(연도)
      // If cell was empty or filled by us, set red
      if (verified.year) {
        const cur = row.getCell(5).value;
        if (!cur || String(cur).trim() === '' || cur === verified.year) {
          setRedCell(5, verified.year);
        }
      }

      // 3. Col 6: 설립연도(월)
      if (verified.month) {
        const cur = row.getCell(6).value;
        if (!cur || String(cur).trim() === '' || cur === verified.month) {
          setRedCell(6, verified.month);
        }
      }

      // 4. Col 7: 대표자 성함
      if (verified.ceo) {
        const cur = row.getCell(7).value;
        if (!cur || String(cur).trim() === '' || cur === verified.ceo) {
          setRedCell(7, verified.ceo);
        }
      }

      // 5. Col 8: 연락처
      if (verified.tel) {
        const cur = row.getCell(8).value;
        if (!cur || String(cur).trim() === '' || cur === verified.tel) {
          setRedCell(8, verified.tel);
        }
      }

      // 6. Col 9: 팩스번호
      if (verified.fax) {
        const cur = row.getCell(9).value;
        if (!cur || String(cur).trim() === '' || cur === verified.fax) {
          setRedCell(9, verified.fax);
        }
      }

      // 7. Col 14: 폐업 날짜
      if (verified.closeDate) {
        setRedCell(14, verified.closeDate);
      }

      // 8. Col 15: 비고
      if (verified.status === '폐업자') {
        setRedCell(15, '폐업');
      }

      // 9. Col 16: 종사자수(명) 25년 기준
      if (verified.emp) {
        setRedCell(16, verified.emp);
      }

      // 10. Col 17: 24년 매출액(원)
      if (r === 2307) {
        // 피커스튜디오 192만원
        setRedCell(17, '1,920,000');
      }

      // 11. Col 19: 데이터 출처
      if (verified.source) {
        setRedCell(19, verified.source);
      }
    } else {
      // For rows NOT recovered by us (original rows that already had data or remaining blanks)
      // Ensure any existing non-empty cell does NOT have red font
      row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
        if (cell.font && cell.font.color && (cell.font.color.argb === 'FFFF0000' || cell.font.color.argb === 'FF0000')) {
          cell.font = blackFont;
          blackResetCells++;
        }
      });
    }
  }

  // Remove any ghost rows after 2314
  if (ws.rowCount > 2314) {
    const toRemove = ws.rowCount - 2314;
    console.log(`Splice out ${toRemove} ghost rows (from 2315 to ${ws.rowCount})...`);
    ws.spliceRows(2315, toRemove);
  }

  // Set freeze pane on row 1
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'A2' }];

  // Auto filter
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 19 }
  };

  console.log(`\n=== UPDATE SUMMARY ===`);
  console.log(`Newly filled verified rows: ${newlyFilledRows}`);
  console.log(`Newly filled RED bold cells: ${newlyFilledCells}`);
  console.log(`Reset accidental red cells to black: ${blackResetCells}`);
  console.log(`Final rowCount: ${ws.rowCount}`);

  // Write to original file
  console.log('Writing directly to original Excel file:', origXlsxPath);
  await wb.xlsx.writeFile(origXlsxPath);
  console.log('SUCCESS: Original Excel updated and saved!');

  // Export CSV
  const csvRows = [];
  for (let r = 1; r <= ws.rowCount; r++) {
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
  fs.writeFileSync(targetCsvPath, csvContent, 'utf8');
  console.log('SUCCESS: Synced CSV file saved:', targetCsvPath);
}

run().catch(err => {
  console.error('ERROR:', err);
});
