const path = require('path');
const ExcelJS = require(path.resolve('./node_modules/exceljs'));

async function inspect() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx');
    const ws = workbook.getWorksheet('기업 정보');
    
    // Print row 1 headers
    console.log('Header Row 1:', ws.getRow(1).values);
    console.log('Header Row 2:', ws.getRow(2).values);

    // Let's search for any row where industry (만화) or representative or company has 이수연, 이지현, 이진수, 최유창, 곽재홍
    const names = ['이수연', '이지현', '이진수', '최유창', '곽재홍', '우수경', '이석창'];
    ws.eachRow((row, rNum) => {
        const valStr = JSON.stringify(row.values);
        for (const n of names) {
            if (valStr.includes(n)) {
                console.log(`Row ${rNum}: ${valStr}`);
            }
        }
    });
}

inspect();
