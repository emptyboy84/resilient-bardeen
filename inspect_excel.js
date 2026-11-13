const ExcelJS = require('exceljs');
const path = require('path');

async function checkRows() {
    const filePath = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];
    
    console.log('Total rows:', ws.rowCount);
    
    // Check row 1318 (마이플랫폼), 1377 (캠버스출판사), and rows around 1412-1428
    const checkIndices = [1318, 1377, 1415, 1416];
    for (let r = 1412; r <= 1430; r++) {
        const val = ws.getRow(r).getCell(2).value;
        const name = ws.getRow(r).getCell(3).value;
        const phone = ws.getRow(r).getCell(11).value;
        if (val || name) {
            console.log(`Row ${r}: Seq=${val}, Name=${name}, Phone=${phone}`);
        }
    }
    
    // 마이플랫폼 and 캠버스
    console.log(`Row 1318: Seq=${ws.getRow(1318).getCell(2).value}, Name=${ws.getRow(1318).getCell(3).value}, Phone=${ws.getRow(1318).getCell(11).value}`);
    console.log(`Row 1377: Seq=${ws.getRow(1377).getCell(2).value}, Name=${ws.getRow(1377).getCell(3).value}, Phone=${ws.getRow(1377).getCell(11).value}`);
}

checkRows();
