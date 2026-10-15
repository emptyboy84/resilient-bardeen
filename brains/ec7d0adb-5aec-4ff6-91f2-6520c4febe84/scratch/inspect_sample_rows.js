const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/node_modules/exceljs');

async function inspectSampleRows() {
    const reader = new ExcelJS.stream.xlsx.WorkbookReader(
        'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx',
        { entries: 'emit', sharedStrings: 'cache', worksheets: 'emit' }
    );

    let header = [];
    let count = 0;
    for await (const worksheet of reader) {
        if (worksheet.name === '기업 정보') {
            for await (const row of worksheet) {
                if (row.number === 1) {
                    header = row.values;
                    continue;
                }
                const v = row.values;
                // If it has 업종_대, 업종_중, 업종_소, 업종_11차 변경, or 코드 filled in
                if (v[48] || v[51] || v[52] || (v[18] && v[18].includes('의료'))) {
                    console.log(`Row ${row.number}:`);
                    console.log(`  회사: ${v[3]}, 업종(NICE): ${v[18]}`);
                    console.log(`  업종코드1: ${v[16]}, 업종코드2: ${v[17]}`);
                    console.log(`  업종_대: ${v[48]}, 업종_중: ${v[49]}, 업종_소: ${v[50]}`);
                    console.log(`  업종_11차 변경: ${v[51]}, 코드: ${v[52]}`);
                    count++;
                    if (count >= 10) break;
                }
            }
            break;
        }
    }
}

inspectSampleRows().catch(err => console.error(err));
