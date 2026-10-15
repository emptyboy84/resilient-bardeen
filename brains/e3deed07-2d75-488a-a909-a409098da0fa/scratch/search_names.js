const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function searchFile(filePath) {
    console.log(`Checking ${filePath}...`);
    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {});
    for await (const worksheetReader of workbook) {
        console.log(`  Sheet: ${worksheetReader.name}`);
        for await (const row of worksheetReader) {
            const values = row.values;
            const str = JSON.stringify(values);
            if (str.includes('조나단') || str.includes('이은석') || str.includes('은석') || str.toLowerCase().includes('jonathan') || str.toLowerCase().includes('eunseok')) {
                console.log(`    Found in sheet ${worksheetReader.name}, row ${row.number}:`, values);
            }
        }
    }
}

async function main() {
    const files = [
        'data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx',
        'data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'
    ];
    for (const f of files) {
        const full = path.resolve('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/jonathan_eunseok_task', f);
        if (fs.existsSync(full)) {
            await searchFile(full);
        } else {
            console.log(`Not found: ${full}`);
        }
    }
}

main().catch(console.error);
