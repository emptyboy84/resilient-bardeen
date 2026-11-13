const ExcelJS = require('exceljs');

async function getMissingList(startSeq, endSeq) {
    const filePath = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx';
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];

    const missing = [];
    for (let r = 2; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        const seq = row.getCell(1).value;
        const name = row.getCell(2).value;
        const ceo = row.getCell(3).value;
        const status = row.getCell(4).value;
        const bno = row.getCell(6).value;
        const addr = row.getCell(9).value;
        const phone = row.getCell(10).value;

        if (seq >= startSeq && seq <= endSeq) {
            if (!phone || String(phone).trim() === '') {
                if (status !== '폐업' && status !== '휴업') {
                    missing.push({ row: r, seq, name, ceo, status, bno, addr });
                }
            }
        }
    }

    console.log(`Missing active companies in Seq ${startSeq}~${endSeq}: ${missing.length}`);
    missing.forEach(m => {
        console.log(`[Seq ${m.seq} | Row ${m.row}] ${m.name} (${m.ceo}) [${m.bno || '사업자없음'}] | ${m.addr}`);
    });
}

getMissingList(501, 700).catch(console.error);
