const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/fill_missing_business_numbers/node_modules/exceljs');

const basePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx';
const outputPath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';

async function verify() {
  const wbBase = new ExcelJS.Workbook();
  await wbBase.xlsx.readFile(basePath);
  const wsBase = wbBase.worksheets[0];

  const wbOut = new ExcelJS.Workbook();
  await wbOut.xlsx.readFile(outputPath);
  const wsOut = wbOut.worksheets[0];

  function isRed(cell) {
    const argb = cell.font && cell.font.color && cell.font.color.argb;
    return argb && argb.toUpperCase() === 'FFFF0000';
  }

  let baseRedTotal = 0;
  let outRedTotal = 0;
  let newRedCells = 0;
  let lostRedCells = 0;
  let newRedDetails = [];

  for (let r = 2; r <= 2314; r++) {
    const baseRow = wsBase.getRow(r);
    const outRow = wsOut.getRow(r);
    for (let c = 1; c <= 19; c++) {
      const baseCell = baseRow.getCell(c);
      const outCell = outRow.getCell(c);
      const baseIsRed = isRed(baseCell);
      const outIsRed = isRed(outCell);
      
      if (baseIsRed) baseRedTotal++;
      if (outIsRed) outRedTotal++;
      
      if (!baseIsRed && outIsRed) {
        newRedCells++;
        if (newRedDetails.length < 20) {
          newRedDetails.push({ row: r, col: c, val: outCell.value });
        }
      }
      if (baseIsRed && !outIsRed) {
        lostRedCells++;
      }
    }
  }

  console.log('=== Comparison: Base (크레탑!!) vs Output (크레탑) ===');
  console.log(`Base RED cells: ${baseRedTotal}`);
  console.log(`Output RED cells: ${outRedTotal}`);
  console.log(`NEW RED cells (not in base): ${newRedCells}`);
  console.log(`LOST RED cells (in base but not in output): ${lostRedCells}`);
  console.log(`\nFirst 20 new RED cells:`);
  for (const d of newRedDetails) {
    console.log(`  Row ${d.row} Col ${d.col}: "${d.val}"`);
  }

  // Check specific row 639 in detail
  console.log('\n--- Row 639 comparison ---');
  for (let c = 1; c <= 19; c++) {
    const bc = wsBase.getRow(639).getCell(c);
    const oc = wsOut.getRow(639).getCell(c);
    const br = isRed(bc);
    const or2 = isRed(oc);
    if (br !== or2 || oc.value !== bc.value) {
      console.log(`  Col ${c}: base="${bc.value}" (${br ? 'RED' : 'BLK'}) -> out="${oc.value}" (${or2 ? 'RED' : 'BLK'})`);
    }
  }

  // Check how many verified rows have ALL expected fields in red
  const fs = require('fs');
  const masterList = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/master_verified_194.json', 'utf8'));
  
  let fullRedRows = 0;
  let partialRedRows = 0;
  let partialDetails = [];
  
  for (const item of masterList) {
    const r = item.rowNumber;
    const outRow = wsOut.getRow(r);
    
    // Check each expected red column
    const expectedRedCols = [4]; // bizno always
    if (item.year) expectedRedCols.push(5);
    if (item.month) expectedRedCols.push(6);
    if (item.ceo) expectedRedCols.push(7);
    if (item.tel) expectedRedCols.push(8);
    if (item.fax) expectedRedCols.push(9);
    if (item.closeDate) expectedRedCols.push(14);
    if (item.status === '폐업자') expectedRedCols.push(15);
    if (item.emp) expectedRedCols.push(16);
    if (item.source) expectedRedCols.push(19);
    
    let missingRed = [];
    for (const c of expectedRedCols) {
      if (!isRed(outRow.getCell(c))) {
        missingRed.push(c);
      }
    }
    
    if (missingRed.length === 0) {
      fullRedRows++;
    } else {
      partialRedRows++;
      if (partialDetails.length < 5) {
        partialDetails.push({ row: r, name: item.name, missingRedCols: missingRed });
      }
    }
  }
  
  console.log(`\n=== Verified Row Font Check ===`);
  console.log(`Rows with ALL expected fields RED: ${fullRedRows}/${masterList.length}`);
  console.log(`Rows with PARTIAL red (missing some): ${partialRedRows}`);
  if (partialDetails.length > 0) {
    console.log('Sample partial rows:');
    for (const d of partialDetails) {
      console.log(`  Row ${d.row} (${d.name}): missing red in cols ${d.missingRedCols.join(',')}`);
    }
  }
}

verify().catch(console.error);
