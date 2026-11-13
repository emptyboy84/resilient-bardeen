const ExcelJS = require('exceljs');

async function inspectHeader() {
    const filePath = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];
    const headerRow = ws.getRow(1);
    
    for (let c = 1; c <= 20; c++) {
        const val = headerRow.getCell(c).value;
        if (val !== undefined && val !== null) {
            console.log(`Col ${c}: ${JSON.stringify(val)}`);
        }
    }

    // Let's inspect Row 1443 ((주)하얀나라) and Row 1454 ((주)이츠에이엠씨대부) and Row 1467 ((주)위치) across all columns
    console.log('\n--- Row 1443 ---');
    const r1443 = ws.getRow(1443);
    for (let c = 1; c <= 15; c++) {
        console.log(`Col ${c}: ${JSON.stringify(r1443.getCell(c).value)} | Fill: ${JSON.stringify(r1443.getCell(c).fill?.fgColor)} | Font: ${JSON.stringify(r1443.getCell(c).font?.color)}`);
    }

    console.log('\n--- Row 1454 ---');
    const r1454 = ws.getRow(1454);
    for (let c = 1; c <= 15; c++) {
        console.log(`Col ${c}: ${JSON.stringify(r1454.getCell(c).value)} | Fill: ${JSON.stringify(r1454.getCell(c).fill?.fgColor)} | Font: ${JSON.stringify(r1454.getCell(c).font?.color)}`);
    }

    console.log('\n--- Row 1467 ---');
    const r1467 = ws.getRow(1467);
    for (let c = 1; c <= 15; c++) {
        console.log(`Col ${c}: ${JSON.stringify(r1467.getCell(c).value)} | Fill: ${JSON.stringify(r1467.getCell(c).fill?.fgColor)} | Font: ${JSON.stringify(r1467.getCell(c).font?.color)}`);
    }
}

inspectHeader().catch(console.error);
