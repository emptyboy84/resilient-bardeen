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

async function main() {
  const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const csvRows = parseFullCSV(csvContent);
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:/Users/lg/Desktop/Today/CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx');
  
  const sheet1 = wb.getWorksheet('실사_매출액_검증완료');
  console.log('=== 실사_매출액_검증완료 28개 검토 ===');
  for (let r = 2; r <= sheet1.rowCount; r++) {
    const row = sheet1.getRow(r);
    const rowNum = row.getCell(1).value;
    const compName = row.getCell(2).value;
    const realBizNo = row.getCell(3).value;
    const s24 = row.getCell(10).value;
    const s25 = row.getCell(11).value;
    const note = row.getCell(12).value;
    const source = row.getCell(13).value;
    
    if (!rowNum) continue;

    // Find row in CSV: check if rowNum matches index or seq
    // In CSV, csvRows[0] is header, csvRows[rowNum - 1] is typically the row if rowNum is 1-indexed line
    let csvRow = csvRows[rowNum - 1];
    let matchedBy = 'index ' + (rowNum - 1);
    
    // Check if name matches, or search by Seq / Name / BizNo
    if (!csvRow || !csvRow[2] || !csvRow[2].includes(compName.replace(/[\(\)\s]/g, '').slice(0, 3))) {
      // Find by Seq
      const foundBySeq = csvRows.find(cr => cr[1] == (rowNum - 1) || cr[1] == rowNum);
      // Find by BizNo
      const foundByBiz = csvRows.find(cr => cr[3] && cr[3].replace(/-/g, '') === String(realBizNo).replace(/-/g, ''));
      // Find by Name
      const cleanCompName = compName.replace(/[\(주\)\s]/g, '');
      const foundByName = csvRows.find(cr => cr[2] && cr[2].replace(/[\(주\)\s]/g, '').includes(cleanCompName));
      
      if (foundByBiz) {
        csvRow = foundByBiz;
        matchedBy = 'BizNo ' + realBizNo;
      } else if (foundByName) {
        csvRow = foundByName;
        matchedBy = 'Name ' + cleanCompName;
      } else if (foundBySeq) {
        csvRow = foundBySeq;
        matchedBy = 'Seq';
      }
    }

    if (csvRow) {
      console.log(`[Excel R${rowNum}] ${compName} | Matched: [${csvRow[1]}] ${csvRow[2]} (${csvRow[3]}) by ${matchedBy}`);
      console.log(`   CSV S24: [${csvRow[16]}], S25: [${csvRow[17]}], Note: [${csvRow[18]}]`);
      console.log(`   EXC S24: [${s24}], S25: [${s25}], Src: [${source}]`);
    } else {
      console.log(`[Excel R${rowNum}] ${compName} | NOT MATCHED IN CSV!`);
    }
  }

  const sheet2 = wb.getWorksheet('국세청_폐업확인_20개사');
  console.log('\n=== 국세청_폐업확인_20개사 검토 ===');
  for (let r = 2; r <= sheet2.rowCount; r++) {
    const row = sheet2.getRow(r);
    const rowNum = row.getCell(1).value;
    const compName = row.getCell(2).value;
    const bizNo = row.getCell(3).value;
    const closeDate = row.getCell(6).value;
    const note = row.getCell(7).value;
    if (!rowNum) continue;

    let csvRow = csvRows.find(cr => cr[3] && cr[3].replace(/-/g, '') === String(bizNo).replace(/-/g, ''));
    if (!csvRow) {
      csvRow = csvRows.find(cr => cr[2] && cr[2].replace(/[\(주\)\s]/g, '') === compName.replace(/[\(주\)\s]/g, ''));
    }
    if (csvRow) {
      console.log(`[Closed R${rowNum}] ${compName} (${bizNo}) -> CSV [${csvRow[1]}] ${csvRow[2]} | Note: [${csvRow[18]}] | CloseDate: ${closeDate}`);
    } else {
      console.log(`[Closed R${rowNum}] ${compName} (${bizNo}) -> NOT FOUND IN CSV`);
    }
  }
}

main();
