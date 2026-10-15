const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

async function testShared() {
  const wb = new xlsx.Workbook();
  const filePath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.xlsx';
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet('기업체 리스트');

  // Let's modify ONLY cell H3
  ws.getCell('H3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8CBAD' }
  };

  await wb.xlsx.writeFile('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/test_out.xlsx');

  const wb2 = new xlsx.Workbook();
  await wb2.xlsx.readFile('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/scratch/test_out.xlsx');
  const ws2 = wb2.getWorksheet('기업체 리스트');
  console.log('Cell A2 fill in test_out:', ws2.getCell('A2').fill);
  console.log('Cell H3 fill in test_out:', ws2.getCell('H3').fill);
}

testShared();
