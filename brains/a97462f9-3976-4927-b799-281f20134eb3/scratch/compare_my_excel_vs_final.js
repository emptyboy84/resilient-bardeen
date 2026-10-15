const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function compareWorkbooks() {
  const wb1 = new xlsx.Workbook();
  const wb2 = new xlsx.Workbook();

  const file1 = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx';
  const file2 = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx';

  await wb1.xlsx.readFile(file1);
  await wb2.xlsx.readFile(file2);

  const ws1 = wb1.getWorksheet('기업체 리스트');
  const ws2 = wb2.getWorksheet('기업체 리스트');

  console.log('ws1 rowCount:', ws1.rowCount, 'ws2 rowCount:', ws2.rowCount);

  const diffs = [];

  for (let r = 2; r <= ws2.rowCount; r++) {
    const row1 = ws1.getRow(r);
    const row2 = ws2.getRow(r);

    const name = row2.getCell(3).value;

    for (let c = 1; c <= 18; c++) {
      let v1 = row1.getCell(c).value;
      let v2 = row2.getCell(c).value;

      if (v1 instanceof Date) v1 = v1.toISOString().split('T')[0];
      if (v2 instanceof Date) v2 = v2.toISOString().split('T')[0];

      const s1 = v1 !== null && v1 !== undefined ? String(v1).trim() : '';
      const s2 = v2 !== null && v2 !== undefined ? String(v2).trim() : '';

      if (s1 !== s2) {
        diffs.push({
          rowNum: r,
          name,
          colIdx: c,
          colName: ws2.getRow(1).getCell(c).value,
          v1: s1,
          v2: s2
        });
      }
    }
  }

  console.log(`Total differences between 배현명_.xlsx and 배현명_최종제출본.xlsx: ${diffs.length}`);
  const colSummary = {};
  diffs.forEach(d => {
    colSummary[d.colName] = (colSummary[d.colName] || 0) + 1;
  });
  console.log('Diffs by column:', colSummary);

  console.log('\nSample 25 differences:');
  diffs.slice(0, 25).forEach(d => {
    console.log(`Row ${d.rowNum} [${d.name}] Col [${d.colName}]: "${d.v1}" -> "${d.v2}"`);
  });
}

compareWorkbooks().catch(console.error);
