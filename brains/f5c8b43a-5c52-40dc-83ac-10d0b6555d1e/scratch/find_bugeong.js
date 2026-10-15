const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/analyze_bae_pattern_data/node_modules/exceljs');

const xlsxPath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_교정완료.xlsx";

async function findBugeong() {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(xlsxPath);
    const ws = wb.getWorksheet('실사DB_전체취합_교정본');

    for (let r = 1; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        const comp = row.getCell(3).value; // col 3 is 회사명
        if (comp && String(comp).includes('부경기계산업')) {
            console.log(`Found 부경기계산업 at Excel row ${r}:`);
            console.log('  작성자 [1]:', row.getCell(1).value);
            console.log('  회사명 [3]:', row.getCell(3).value);
            console.log('  전화번호 [8]:', row.getCell(8).value, 'font:', JSON.stringify(row.getCell(8).font), 'fill:', JSON.stringify(row.getCell(8).fill));
            console.log('  종업원수 [15]:', row.getCell(15).value, 'font:', JSON.stringify(row.getCell(15).font));
            console.log('  업종(NICE) [18]:', row.getCell(18).value);
            console.log('  주생산품 [19]:', row.getCell(19).value, 'font:', JSON.stringify(row.getCell(19).font));
            console.log('  사업자번호 [24]:', row.getCell(24).value, 'font:', JSON.stringify(row.getCell(24).font));
            console.log('  결산월 [31]:', row.getCell(31).value, 'font:', JSON.stringify(row.getCell(31).font));
            break;
        }
    }
}

findBugeong().catch(console.error);
