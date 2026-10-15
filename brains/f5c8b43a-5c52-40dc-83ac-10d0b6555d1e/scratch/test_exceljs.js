const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/analyze_bae_pattern_data/node_modules/exceljs');

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet('테스트');
ws.getCell('A1').value = '테스트 회사';
ws.getCell('B1').value = '수정된 값';
ws.getCell('B1').font = { color: { argb: 'FF002060' }, bold: true };
ws.getCell('B1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9E1F2' }
};

wb.xlsx.writeFile('C:\\Users\\lg\\.gemini\antigravity\\brain\\f5c8b43a-5c52-40dc-83ac-10d0b6555d1e\\scratch\\test.xlsx')
    .then(() => console.log('Excel write success'))
    .catch(console.error);
