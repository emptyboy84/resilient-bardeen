const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/node_modules/exceljs');

async function searchExcel() {
    const filePath = 'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx';
    console.log('Reading:', filePath);
    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(
        filePath,
        { entries: 'emit', sharedStrings: 'cache', worksheets: 'emit' }
    );

    for await (const worksheet of workbook) {
        console.log('Worksheet:', worksheet.name);
        for await (const row of worksheet) {
            const values = row.values;
            const str = JSON.stringify(values);
            if (str.includes('6040126041') || str.includes('604-01-26041') || str.includes('한독메디칼') || str.includes('한독메다칼')) {
                console.log('Found in row:', row.number, values);
            }
        }
    }
    console.log('Search complete.');
}

searchExcel().catch(err => console.error(err));
