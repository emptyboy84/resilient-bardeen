const fs = require('fs');
const ExcelJS = require('exceljs');

const baselinePath = 'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명_전화번호통합검증_261015.xlsx';

const targetFiles = [
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx',
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_최신동기화본.xlsx'
];

async function applyRedBlackFormat() {
  console.log('Loading baseline original file:', baselinePath);
  const wbOrig = new ExcelJS.Workbook();
  await wbOrig.xlsx.readFile(baselinePath);
  const wsOrig = wbOrig.worksheets[0];

  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) {
      console.log('File not found:', filePath);
      continue;
    }
    console.log(`\n========================================`);
    console.log(`Processing ${filePath}...`);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];

    let blackCount = 0;
    let redCount = 0;
    const redSamples = [];

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const cell = row.getCell(10);
      const val = cell.value ? String(cell.value).trim() : '';

      if (!val) {
        cell.fill = { type: 'pattern', pattern: 'none' };
        continue;
      }

      const origCell = wsOrig.getRow(r).getCell(10);
      const origVal = origCell.value ? String(origCell.value).trim() : '';
      const origIsRed = Boolean(origCell.font && origCell.font.color && (origCell.font.color.argb === 'FFFF0000'));

      // 기준: 제일 처음 원본 상태(261015 기준 검은색으로 기재되어 있던 번호)와 일치하는 경우 -> 검은색
      const isOriginal = (origVal !== '' && !origIsRed && origVal === val);

      if (isOriginal) {
        cell.style = Object.assign({}, cell.style, {
          font: { name: '맑은 고딕', size: 11, bold: false, color: { argb: 'FF000000' } },
          fill: { type: 'pattern', pattern: 'none' },
          alignment: { vertical: 'middle', horizontal: 'center' }
        });
        blackCount++;
      } else {
        // 새로 입력하거나 수정한 것 -> 빨간색 (굵게, 배경색 없음)
        cell.style = Object.assign({}, cell.style, {
          font: { name: '맑은 고딕', size: 11, bold: true, color: { argb: 'FFFF0000' } },
          fill: { type: 'pattern', pattern: 'none' },
          alignment: { vertical: 'middle', horizontal: 'center' }
        });
        redCount++;
        if (redSamples.length < 10) {
          redSamples.push({ row: r, name: row.getCell(2).value, phone: val });
        }
      }
    }

    await wb.xlsx.writeFile(filePath);
    console.log(`[적용 완료] ${filePath}`);
    console.log(`- 기존 원본(제일 처음 원본 상태): 검은색 ${blackCount}건`);
    console.log(`- 새로 입력/수정한 것: 빨간색 ${redCount}건`);
    console.log('새로 입력 빨간색 샘플:', redSamples.slice(0, 5));
  }
}

applyRedBlackFormat().catch(err => {
  console.error('Error in applyRedBlackFormat:', err);
});
