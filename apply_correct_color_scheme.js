const ExcelJS = require('exceljs');

async function main() {
  const backupPath = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명_backup_before_step1.xlsx';
  const targetFiles = [
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx'
  ];

  console.log('1. Reading backup file to classify rows...');
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

  console.log(`- 배현명 님 직접 추가분 (빨간색 글꼴 유지 대상): ${userRedRows.size}건`);
  console.log(`- 기존 크레탑 원본 기본 번호 (검정색 글꼴 유지 대상): ${origBlackRows.size}건`);

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
      const cell = row.getCell(10);
      const val = cell.value;

      // Extract existing non-style properties to preserve
      const border = cell.border;
      const alignment = cell.alignment;
      const numFmt = cell.numFmt;

      if (val && String(val).trim()) {
        if (userRedRows.has(r)) {
          // 1. 배현명 님 직접 추가분: 빨간색 폰트, 배경 채우기 없음
          cell.style = {
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
          // 2. 크레탑 원본 기본 번호: 기본 검정 폰트, 배경 채우기 없음
          cell.style = {
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
          // 3. AI 신규 발굴/추가 번호: 연초록 배경 (FFC6EFCE) + 짙은 초록 볼드 폰트 (FF006100)
          cell.style = {
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
        // 미발굴 공란
        cell.style = {
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

    console.log(`  적용 통계: 빨간색(배현명 님)=${countRed}, 검정색(기본 원본)=${countBlack}, 초록색(AI 발굴)=${countGreen}, 공란=${countBlank}`);
    console.log(`  총 유효 번호 수: ${countRed + countBlack + countGreen}건`);

    await wb.xlsx.writeFile(filePath);
    console.log(`  저장 완료: ${filePath}`);
  }

  console.log('\n모든 파일 서식 적용 및 저장 완료!');
}

main().catch(err => {
  console.error('실행 중 오류 발생:', err);
  process.exit(1);
});
