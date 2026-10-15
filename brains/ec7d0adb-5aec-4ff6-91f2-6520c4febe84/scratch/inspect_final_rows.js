const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/node_modules/exceljs');

async function inspectFinalRows() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx');
    const sheet = workbook.getWorksheet('배현명_전수검증완료');
    
    // Check rows where 업종 has 의료 or 정밀
    let count = 0;
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            console.log('Headers:', row.values);
            return;
        }
        const str = JSON.stringify(row.values);
        if (str.includes('의료') || str.includes('치과')) {
            console.log(`Row ${rowNumber}:`, {
                회사: row.values[4],
                업종NICE: row.values[14],
                대: row.values[17],
                중: row.values[18],
                소: row.values[19],
            });
            count++;
        }
    });
    console.log(`Found ${count} rows`);
}

inspectFinalRows().catch(err => console.error(err));
