const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/node_modules/exceljs');

async function inspectRow() {
    const workbook = new ExcelJS.Workbook();
    // Since reading the whole 11MB file with Workbook might take memory, let's use stream reader
    const reader = new ExcelJS.stream.xlsx.WorkbookReader(
        'C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/find_industry_code_6040126041/data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx',
        { entries: 'emit', sharedStrings: 'cache', worksheets: 'emit' }
    );

    let header = [];
    for await (const worksheet of reader) {
        if (worksheet.name === '기업 정보') {
            for await (const row of worksheet) {
                if (row.number === 1) {
                    header = row.values;
                }
                if (row.number === 13120) {
                    console.log('Row 13120 data:');
                    for (let i = 1; i < Math.max(header.length, row.values.length); i++) {
                        if (header[i] || row.values[i]) {
                            console.log(`Col ${i} [${header[i] || ''}]: ${row.values[i] || ''}`);
                        }
                    }
                    break;
                }
            }
            break;
        }
    }
}

inspectRow().catch(err => console.error(err));
