const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/node_modules/exceljs');

async function find11thFilled() {
    const reader = new ExcelJS.stream.xlsx.WorkbookReader(
        'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx',
        { entries: 'emit', sharedStrings: 'cache', worksheets: 'emit' }
    );

    let count = 0;
    for await (const worksheet of reader) {
        if (worksheet.name === '기업 정보') {
            for await (const row of worksheet) {
                const v = row.values;
                if (v[51] || v[52] || v[16] || v[17]) {
                    console.log(`Row ${row.number}: [16]=${v[16]}, [17]=${v[17]}, [51]=${v[51]}, [52]=${v[52]}, 회사=${v[3]}, 업종=${v[18]}`);
                    count++;
                    if (count >= 15) break;
                }
            }
            break;
        }
    }
    console.log(`Total found: ${count}`);
}

find11thFilled().catch(err => console.error(err));
