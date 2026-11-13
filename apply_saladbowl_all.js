const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function updateFile(filePath) {
  console.log(`Processing: ${filePath}`);
  const tempPath = path.join(__dirname, 'temp_update_' + Date.now() + '.xlsx');
  
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.worksheets[0];

  const rowNumber = 1107; // Seq 1106: (주)샐러드볼
  const row = ws.getRow(rowNumber);

  console.log(`Before: Col 1: ${row.getCell(1).value}, Col 2: ${row.getCell(2).value}, Col 10: ${row.getCell(10).value}`);

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
      color: { argb: 'FF006100' } // 짙은 초록 볼드
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC6EFCE' } // 연초록 배경
    },
    border: existingBorder,
    alignment: {
      horizontal: 'center',
      vertical: 'middle'
    }
  };

  // 임시 파일로 먼저 기록
  await wb.xlsx.writeFile(tempPath);
  
  // 원본에 덮어쓰기 복사
  fs.copyFileSync(tempPath, filePath);
  fs.unlinkSync(tempPath);

  // 검증
  const verifyWb = new ExcelJS.Workbook();
  await verifyWb.xlsx.readFile(filePath);
  const verifyRow = verifyWb.worksheets[0].getRow(rowNumber);
  const vCell = verifyRow.getCell(10);
  console.log(`After: Col 10 value: ${vCell.value}, font color: ${vCell.style.font?.color?.argb}, fill: ${vCell.style.fill?.fgColor?.argb}`);
}

async function main() {
  const targetFiles = [
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx',
    'C:/Users/lg/Documents/카카오톡 받은 파일/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx'
  ];

  for (const f of targetFiles) {
    if (fs.existsSync(f)) {
      try {
        await updateFile(f);
      } catch (err) {
        console.error(`Failed on ${f}:`, err.message);
      }
    } else {
      console.log(`File not found: ${f}`);
    }
  }
}

main().catch(console.error);
