const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/node_modules/exceljs');

async function searchFinal() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx');
    const sheet = workbook.getWorksheet('배현명_전수검증완료');
    sheet.eachRow((row, rowNumber) => {
        const str = JSON.stringify(row.values);
        if (str.includes('6040126041') || str.includes('604-01-26041') || str.includes('한독메')) {
            console.log(`Found in row ${rowNumber}:`, row.values);
        }
    });
    console.log('Done searching 배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx');
}

searchFinal().catch(err => console.error(err));
