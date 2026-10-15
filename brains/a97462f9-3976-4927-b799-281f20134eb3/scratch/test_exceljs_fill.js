const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function test() {
  const wb = new xlsx.Workbook();
  const ws = wb.addWorksheet('test');
  ws.addRow(['A', 'B', 'C']);
  ws.addRow(['1', '2', '3']);
  
  const fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8CBAD' } };
  ws.getRow(2).getCell(2).fill = fill;
  
  console.log('Cell 1 fill:', ws.getRow(2).getCell(1).fill);
  console.log('Cell 2 fill:', ws.getRow(2).getCell(2).fill);
  console.log('Cell 3 fill:', ws.getRow(2).getCell(3).fill);
}

test();
