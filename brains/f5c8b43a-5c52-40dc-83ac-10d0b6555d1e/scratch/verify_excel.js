const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/analyze_bae_pattern_data/node_modules/exceljs');

const xlsxPath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_교정완료.xlsx";

async function verifyExcel() {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(xlsxPath);
    console.log('Worksheets count:', wb.worksheets.length);
    wb.worksheets.forEach(ws => console.log(`- Worksheet: ${ws.name}, rowCount: ${ws.rowCount}`));

    const wsData = wb.getWorksheet('실사DB_전체취합_교정본');
    // check line 5435 (which in 1-based row index in excel will be 5435 if row 1 is header and line 1 was header)
    // Let's verify line 5435 in wsData:
    const r5435 = wsData.getRow(5435);
    console.log('\nRow 5435 verification:');
    console.log('  회사명:', r5435.getCell(3).value); // col C is index 3 (회사명)
    console.log('  전화번호:', r5435.getCell(8).value, 'style:', JSON.stringify(r5435.getCell(8).font), JSON.stringify(r5435.getCell(8).fill));
    console.log('  종업원수:', r5435.getCell(15).value);
    console.log('  주생산품 [19]:', r5435.getCell(19).value);
    console.log('  사업자번호 [24]:', r5435.getCell(24).value);
    console.log('  결산월 [31]:', r5435.getCell(31).value);

    // check sheet 2
    const wsLog = wb.getWorksheet('배현명_교정내역_상세');
    console.log('\nSheet 2 sample rows:');
    for (let r = 2; r <= 6; r++) {
        const row = wsLog.getRow(r);
        console.log(`  Log #${r-1}: 행 ${row.getCell(2).value} | ${row.getCell(3).value} | ${row.getCell(4).value} | "${row.getCell(5).value}" -> "${row.getCell(6).value}" (${row.getCell(7).value})`);
    }
}

verifyExcel().catch(console.error);
