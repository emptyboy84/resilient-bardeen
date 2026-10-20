const ExcelJS = require('exceljs');

async function main() {
  const backupPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명_backup_before_step1.xlsx';
  const targetFiles = [
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx'
  ];

  // 1. Identify user red rows vs orig black rows
  const wbBackup = new ExcelJS.Workbook();
  await wbBackup.xlsx.readFile(backupPath);
  const wsBackup = wbBackup.worksheets[0];

  const userRedRows = new Set();
  const origBlackRows = new Set();

  for (let r = 2; r <= wsBackup.rowCount; r++) {
    const cell = wsBackup.getRow(r).getCell(10);
    const val = cell.value;
    if (val && String(val).trim()) {
      const font = cell.font;
      if (font && font.color && font.color.argb === 'FFFF0000') {
        userRedRows.add(r);
      } else {
        origBlackRows.add(r);
      }
    }
  }

  console.log(`- 배현명 님 직접 추가 (빨간 글자, fill 없음): ${userRedRows.size}건`);
  console.log(`- 기본 원본 (검정 글자, fill 없음): ${origBlackRows.size}건`);

  for (const filePath of targetFiles) {
    console.log(`\nProcessing: ${filePath}`);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];

    let countRed = 0;
    let countBlack = 0;
    let countGreen = 0;
    let countBlank = 0;

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);

      // A. For all non-phone columns (1~9, 11~17): pure clean black font, no fill!
      for (let c = 1; c <= 17; c++) {
        if (c !== 10) {
          const cell = row.getCell(c);
          cell.style = {
            numFmt: cell.numFmt,
            border: cell.border,
            alignment: cell.alignment,
            fill: { type: 'pattern', pattern: 'none' },
            font: {
              name: '맑은 고딕',
              size: (c === 1 || c === 2) ? 11 : 10,
              bold: false,
              color: { argb: 'FF000000' }
            }
          };
        }
      }

      // B. For column 10 (전화번호):
      const cell10 = row.getCell(10);
      const val10 = cell10.value ? String(cell10.value).trim() : '';

      if (!val10) {
        countBlank++;
        cell10.value = null;
        cell10.style = {
          numFmt: cell10.numFmt,
          border: cell10.border,
          alignment: cell10.alignment,
          fill: { type: 'pattern', pattern: 'none' },
          font: { name: '맑은 고딕', size: 10, bold: false, color: { argb: 'FF000000' } }
        };
      } else if (userRedRows.has(r)) {
        countRed++;
        cell10.value = val10;
        cell10.style = {
          numFmt: cell10.numFmt,
          border: cell10.border,
          alignment: cell10.alignment,
          fill: { type: 'pattern', pattern: 'none' },
          font: { name: '맑은 고딕', size: 10, bold: false, color: { argb: 'FFFF0000' } }
        };
      } else if (origBlackRows.has(r)) {
        countBlack++;
        cell10.value = val10;
        cell10.style = {
          numFmt: cell10.numFmt,
          border: cell10.border,
          alignment: cell10.alignment,
          fill: { type: 'pattern', pattern: 'none' },
          font: { name: '맑은 고딕', size: 10, bold: false, color: { argb: 'FF000000' } }
        };
      } else {
        // AI newly discovered! ONLY this cell is colored green!
        countGreen++;
        cell10.value = val10;
        cell10.style = {
          numFmt: cell10.numFmt,
          border: cell10.border,
          alignment: cell10.alignment,
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC6EFCE' }
          },
          font: {
            name: '맑은 고딕',
            size: 10,
            bold: true,
            color: { argb: 'FF006100' }
          }
        };
      }
    }

    console.log(`  Row count: ${ws.rowCount - 1}`);
    console.log(`  - 배현명 님 추가분 (빨간 글씨, fill 없음): ${countRed}`);
    console.log(`  - 크레탑 기본 번호 (검정 글씨, fill 없음): ${countBlack}`);
    console.log(`  - AI 신규 발굴분 (초록 글씨, 연초록 fill): ${countGreen}`);
    console.log(`  - 미발굴/공란 (검정 글씨, fill 없음): ${countBlank}`);
    console.log(`  - 총 전화번호 보유: ${countRed + countBlack + countGreen}`);

    await wb.xlsx.writeFile(filePath);
    console.log(`  Saved: ${filePath}`);
  }

  console.log('\nAll 3 Excel files updated successfully!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
