const path = require('path');
const workspaceRoot = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store';
const ExcelJS = require(path.join(workspaceRoot, 'node_modules/exceljs'));

async function main() {
  const filePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업체 리스트');

  const blueRows = [];

  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    let hasBlue = false;
    let blueCols = [];

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const fill = cell.fill;
      if (fill && fill.fgColor) {
        const fg = fill.fgColor;
        if (fg.theme === 8 || fg.theme === 4 || (fg.argb && (fg.argb.includes('DDEBF7') || fg.argb.includes('BDD7EE')))) {
          hasBlue = true;
          blueCols.push(colNumber);
        }
      }
    });

    if (hasBlue) {
      const vals = Array.isArray(row.values) ? row.values.slice(1) : [];
      blueRows.push({
        rowNumber,
        blueCols,
        sn: vals[1],
        name: vals[2],
        bizno: vals[3],
        rep: vals[6],
        phone: vals[7],
        category: vals[11],
        status: vals[12],
        rev24: vals[16],
        rev25: vals[17]
      });
    }
  });

  console.log(`Total blue rows: ${blueRows.length}`);
  const withRev = blueRows.filter(r => r.rev24 !== undefined || r.rev25 !== undefined);
  const withoutRev = blueRows.filter(r => r.rev24 === undefined && r.rev25 === undefined);

  console.log(`With revenue already in sheet: ${withRev.length}`);
  console.log(`Without revenue in sheet: ${withoutRev.length}`);

  console.log('\n=== Already has revenue in sheet ===');
  withRev.forEach(r => {
    console.log(`[Row ${r.rowNumber}] 순번: ${r.sn} | 업체명: ${r.name} | 사업자번호: ${r.bizno} | 대표: ${r.rep} | 24년: ${r.rev24} | 25년: ${r.rev25}`);
  });

  console.log('\n=== All blue rows listing ===');
  blueRows.forEach((r, idx) => {
    console.log(`${idx + 1}. [Row ${r.rowNumber}] 순번: ${r.sn} | ${r.name} | 사업자: ${r.bizno} | 대표: ${r.rep} | 24년: ${r.rev24 || '-'} | 25년: ${r.rev25 || '-'}`);
  });
}

main().catch(console.error);
