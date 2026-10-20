const ExcelJS = require('exceljs');

async function main() {
  const backupPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명_backup_before_step1.xlsx';
  const targetFiles = [
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx'
  ];

  // 1. Identify 배현명 님 추가분 (240건) vs 크레탑 기본 번호 (733건)
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
    let clearedOtherCols = 0;

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);

      // A. For all non-phone columns (1~9, 11~17): CLEAR any fill!
      for (let c = 1; c <= 17; c++) {
        if (c !== 10) {
          const cell = row.getCell(c);
          if (cell.fill && cell.fill.type === 'pattern' && cell.fill.pattern !== 'none') {
            clearedOtherCols++;
          }
          // Assign clean style without fill
          cell.style = {
            numFmt: cell.numFmt,
            border: cell.border,
            alignment: cell.alignment,
            font: cell.font ? {
              name: cell.font.name || '맑은 고딕',
              size: cell.font.size || 10,
              bold: cell.font.bold || false,
              color: cell.font.color || { argb: 'FF000000' }
            } : { name: '맑은 고딕', size: 10, color: { argb: 'FF000000' } }
          };
        }
      }

      // B. For column 10 (전화번호): ONLY color the found AI phone numbers!
      const cell10 = row.getCell(10);
      const val10 = cell10.value ? String(cell10.value).trim() : '';

      const border = cell10.border;
      const alignment = cell10.alignment;
      const numFmt = cell10.numFmt;

      if (val10) {
        if (userRedRows.has(r)) {
          // 1. 배현명 님 직접 추가분: 빨간색 폰트, 배경 채우기 없음!
          cell10.style = {
            numFmt,
            border,
            alignment,
            font: {
              name: '맑은 고딕',
              size: 10,
              bold: false,
              color: { argb: 'FFFF0000' }
            }
          };
          countRed++;
        } else if (origBlackRows.has(r)) {
          // 2. 크레탑 원본 기본 번호: 기본 검정 폰트, 배경 채우기 없음!
          cell10.style = {
            numFmt,
            border,
            alignment,
            font: {
              name: '맑은 고딕',
              size: 10,
              bold: false,
              color: { argb: 'FF000000' }
            }
          };
          countBlack++;
        } else {
          // 3. AI가 신규 발굴한 번호: 찾은 전화번호 셀만 연초록 배경 + 짙은 초록 글자!
          cell10.style = {
            numFmt,
            border,
            alignment,
            font: {
              name: '맑은 고딕',
              size: 10,
              bold: true,
              color: { argb: 'FF006100' }
            },
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFC6EFCE' }
            }
          };
          countGreen++;
        }
      } else {
        // 미발굴 공란: 배경 채우기 없음!
        cell10.style = {
          numFmt,
          border,
          alignment,
          font: {
            name: '맑은 고딕',
            size: 10,
            bold: false,
            color: { argb: 'FF000000' }
          }
        };
        countBlank++;
      }
    }

    console.log(`  적용 결과:`);
    console.log(`  - 10열 이외 타 컬럼에서 지운 잘못된 배경색: ${clearedOtherCols}개 셀`);
    console.log(`  - 10열 배현명 님 추가분 (빨간 글씨, 배경색 없음): ${countRed}건`);
    console.log(`  - 10열 크레탑 원본 (검정 글씨, 배경색 없음): ${countBlack}건`);
    console.log(`  - 10열 AI 신규 발굴 (초록 배경색 채움): ${countGreen}건`);
    console.log(`  - 10열 공란 (배경색 없음): ${countBlank}건`);

    await wb.xlsx.writeFile(filePath);
    console.log(`  저장 완료: ${filePath}`);
  }

  console.log('\n모든 파일 서식 정밀 교정 완료!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
