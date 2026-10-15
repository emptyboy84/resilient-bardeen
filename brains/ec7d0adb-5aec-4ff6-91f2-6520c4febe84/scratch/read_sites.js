const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/node_modules/exceljs');

async function readSites() {
    const reader = new ExcelJS.stream.xlsx.WorkbookReader(
        'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx',
        { entries: 'emit', sharedStrings: 'cache', worksheets: 'emit' }
    );

    for await (const worksheet of reader) {
        if (worksheet.name === '사용 사이트') {
            for await (const row of worksheet) {
                console.log(row.values);
            }
            break;
        }
    }
}

readSites().catch(err => console.error(err));
