const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const targetFiles = [
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx',
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_최신동기화본.xlsx'
];

const updates = [
    { row: 1318, name: '마이플랫폼(주)', phone: '070-5236-4882' },
    { row: 1377, name: '캠버스출판사', phone: '051-808-2325' },
    { row: 1416, name: '아이비뮤직댄스콘텐츠', phone: '051-517-7077' }
];

async function updateExcelFiles() {
    for (const filePath of targetFiles) {
        if (!fs.existsSync(filePath)) {
            console.log('File not found, skip:', filePath);
            continue;
        }

        console.log('Processing:', filePath);
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(filePath);
        const ws = wb.worksheets[0];

        for (const u of updates) {
            const row = ws.getRow(u.row);
            const compName = row.getCell(2).value;
            console.log(`Checking Row ${u.row}: Expected ${u.name}, Found ${compName}`);

            const cell = row.getCell(11); // 전화번호 열 (K열)
            cell.value = u.phone;
            
            // Apply single-cell green highlight (연초록 배경 + 짙은 초록 볼드)
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
        }

        await wb.xlsx.writeFile(filePath);
        console.log('Successfully updated and saved:', filePath);
    }
}

updateExcelFiles();
