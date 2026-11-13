const ExcelJS = require('exceljs');
const fs = require('fs');

async function inspectFile() {
    const filePath = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
    if (!fs.existsSync(filePath)) {
        console.log('File does not exist:', filePath);
        return;
    }

    const stat = fs.statSync(filePath);
    console.log('File size:', stat.size);
    console.log('Last modified:', stat.mtime);

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];
    console.log('Sheet name:', ws.name);
    console.log('Row count:', ws.rowCount);

    // Let's find green cells (AI filled) and red text cells (User filled) around rows 1000 to 1600
    const aiUpdates = [];
    const redTextCells = [];
    let lastFilledRow = 0;

    for (let r = 1; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        const cellK = row.getCell(11); // K column: phone
        const val = cellK.value;
        const fontColor = cellK.font?.color?.argb;
        const fillColor = cellK.fill?.fgColor?.argb;

        if (fillColor === 'FFC6EFCE' || fontColor === 'FF006100') {
            aiUpdates.push({ row: r, seq: row.getCell(1).value, name: row.getCell(2).value, phone: val, fill: fillColor, font: fontColor });
        }
        if (fontColor === 'FFFF0000' || fontColor === 'FF0000') {
            redTextCells.push({ row: r, seq: row.getCell(1).value, name: row.getCell(2).value, phone: val });
        }
        if (val) {
            lastFilledRow = r;
        }
    }

    console.log('\n=== Recent AI Green Highlights (Last 10) ===');
    aiUpdates.slice(-10).forEach(u => console.log(`Row ${u.row} (Seq ${u.seq}): ${u.name} -> ${u.phone}`));

    console.log('\n=== Recent User Red Text Cells (Last 10) ===');
    redTextCells.slice(-10).forEach(u => console.log(`Row ${u.row} (Seq ${u.seq}): ${u.name} -> ${u.phone}`));

    console.log('\nLast row with any phone number:', lastFilledRow);
    const lastRowObj = ws.getRow(lastFilledRow);
    console.log(`Last row details: Row ${lastFilledRow}, Seq: ${lastRowObj.getCell(1).value}, Name: ${lastRowObj.getCell(2).value}, Phone: ${lastRowObj.getCell(11).value}`);

    // Check rows around 1460 to 1480
    console.log('\n=== Rows 1460 to 1475 status ===');
    for (let r = 1460; r <= 1475; r++) {
        const row = ws.getRow(r);
        console.log(`Row ${r}: Seq=${row.getCell(1).value}, Name=${row.getCell(2).value}, Phone=${row.getCell(11).value || '(빈칸)'}`);
    }
}

inspectFile().catch(console.error);
