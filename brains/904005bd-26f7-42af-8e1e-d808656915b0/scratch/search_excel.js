const path = require('path');
const ExcelJS = require(path.resolve('./node_modules/exceljs'));
const fs = require('fs');

const targets = ['최유창', '곽재홍', '이진수', '이수연', '이지현', '우수경', '이석창'];

async function checkExcel(filePath) {
    if (!fs.existsSync(filePath)) return;
    console.log(`=== Checking ${filePath} ===`);
    const workbook = new ExcelJS.Workbook();
    try {
        await workbook.xlsx.readFile(filePath);
        console.log('Sheet names:', workbook.worksheets.map(w => w.name));
        workbook.eachSheet((worksheet, sheetId) => {
            console.log(`Scanning sheet: ${worksheet.name}, rows: ${worksheet.rowCount}`);
            worksheet.eachRow((row, rowNumber) => {
                const values = row.values;
                if (!values) return;
                const rowStr = (Array.isArray(values) ? values.join(' | ') : JSON.stringify(values));
                for (const t of targets) {
                    if (rowStr.includes(t)) {
                        console.log(`[${worksheet.name}:${rowNumber}] MATCH ${t}: ${rowStr}`);
                    }
                }
            });
        });
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e.message);
    }
}

checkExcel('data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
