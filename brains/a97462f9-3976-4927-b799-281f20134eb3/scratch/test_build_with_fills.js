const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function testBuild() {
  const wb = new xlsx.Workbook();
  const ws = wb.addWorksheet('Sheet1');
  ws.addRow(['A', 'B', 'C']);

  const brownFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8CBAD' }
  };

  const r1 = ws.addRow(['val1', '', 'val3']);
  // Only cell 2 has brown fill
  r1.getCell(2).fill = brownFill;

  const r2 = ws.addRow(['val4', 'val5', '']);
  r2.getCell(3).fill = brownFill;

  await wb.xlsx.writeFile('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/test_build_out.xlsx');

  const wb2 = new xlsx.Workbook();
  await wb2.xlsx.readFile('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/test_build_out.xlsx');
  const ws2 = wb2.getWorksheet('Sheet1');

  console.log('Row 2 Cell 1 fill (should be none):', ws2.getRow(2).getCell(1).fill);
  console.log('Row 2 Cell 2 fill (should be brown):', ws2.getRow(2).getCell(2).fill);
  console.log('Row 2 Cell 3 fill (should be none):', ws2.getRow(2).getCell(3).fill);
  console.log('Row 3 Cell 2 fill (should be none):', ws2.getRow(3).getCell(2).fill);
  console.log('Row 3 Cell 3 fill (should be brown):', ws2.getRow(3).getCell(3).fill);
}

testBuild();
