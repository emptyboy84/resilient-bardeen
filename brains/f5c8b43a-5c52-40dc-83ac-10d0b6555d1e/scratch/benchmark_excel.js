const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/analyze_bae_pattern_data/node_modules/exceljs');

async function testPerformance() {
    console.time('Workbook creation');
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Test');

    for (let r = 1; r <= 20504; r++) {
        const row = [];
        for (let c = 1; c <= 25; c++) {
            row.push(`R${r}C${c}`);
        }
        const added = ws.addRow(row);
        if (r % 500 === 0) {
            added.getCell(2).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9E1F2' }
            };
            added.getCell(2).font = { color: { argb: 'FF002060' }, bold: true };
        }
    }
    console.timeEnd('Workbook creation');

    console.time('Write to buffer/file');
    // Just test in memory
    const buffer = await wb.xlsx.writeBuffer();
    console.timeEnd('Write to buffer/file');
    console.log('Buffer size MB:', (buffer.length / (1024 * 1024)).toFixed(2));
}

testPerformance().catch(console.error);
