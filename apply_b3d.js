const ExcelJS = require('exceljs');
const fs = require('fs');

const targetFiles = [
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx',
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_최신동기화본.xlsx'
];

async function updateB3D() {
    for (const filePath of targetFiles) {
        if (!fs.existsSync(filePath)) continue;
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(filePath);
        const ws = wb.worksheets[0];

        const row = ws.getRow(217);
        const name = row.getCell(2).value;
        console.log(`Checking Row 217: Expected (주)비쓰리디, Found ${name}`);

        const cell = row.getCell(10);
        cell.value = '070-8777-1337';
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC6EFCE' }
        };
        cell.font = {
            color: { argb: 'FF006100' },
            bold: true,
            size: cell.font ? cell.font.size : 10,
            name: cell.font ? cell.font.name : '맑은 고딕'
        };

        await wb.xlsx.writeFile(filePath);
        console.log(`Saved Row 217 -> 070-8777-1337 in ${filePath}`);
    }
}

updateB3D().catch(console.error);
