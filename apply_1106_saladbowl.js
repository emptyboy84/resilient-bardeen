const ExcelJS = require('exceljs');
const fs = require('fs');

async function applySaladbowlPhone() {
  const filePath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx';
  const backupPath = 'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달_backup_before_1106.xlsx';
  
  // 1. 안전 백업 생성
  fs.copyFileSync(filePath, backupPath);
  console.log('Backup created:', backupPath);

  // 2. 엑셀 로드
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  const targetRowNumber = 1107; // Seq 1106
  const row = ws.getRow(targetRowNumber);
  
  console.log('Before update:');
  console.log('Col 1 (Seq):', row.getCell(1).value);
  console.log('Col 2 (Name):', row.getCell(2).value);
  console.log('Col 3 (CEO):', row.getCell(3).value);
  console.log('Col 10 (Phone):', row.getCell(10).value);

  // 3. 10열 셀 값 및 서식 업데이트 (AI 신규 발굴 서식: 연초록 배경 FFC6EFCE + 짙은 초록 볼드 FF006100)
  const cell = row.getCell(10);
  cell.value = '010-2579-3527';
  
  const existingBorder = cell.border || {
    top: { style: 'thin', color: { indexed: 64 } },
    left: { style: 'thin', color: { indexed: 64 } },
    bottom: { style: 'thin', color: { indexed: 64 } },
    right: { style: 'thin', color: { indexed: 64 } }
  };

  cell.style = {
    numFmt: '@',
    font: {
      name: '맑은 고딕',
      size: 11,
      bold: true,
      color: { argb: 'FF006100' }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC6EFCE' }
    },
    border: existingBorder,
    alignment: {
      horizontal: 'center',
      vertical: 'middle'
    }
  };

  // 4. 저장
  await wb.xlsx.writeFile(filePath);
  console.log('Successfully saved to:', filePath);

  // 5. 검증 로드
  const verifyWb = new ExcelJS.Workbook();
  await verifyWb.xlsx.readFile(filePath);
  const verifyWs = verifyWb.worksheets[0];
  const verifyRow = verifyWs.getRow(targetRowNumber);
  const vCell = verifyRow.getCell(10);
  console.log('Verified updated cell:');
  console.log('Value:', vCell.value);
  console.log('Style:', JSON.stringify(vCell.style));
}

applySaladbowlPhone().catch(console.error);
