const ExcelJS = require('exceljs');
const fs = require('fs');

const unmaskedUpdates = [
  { row: 43, seq: 42, name: '(주)에스오더', phone: '1811-6201', source: 'Official-Web(sorder.io)' },
  { row: 245, seq: 244, name: '(주)노매드헐', phone: '010-5148-7598', source: 'Apple-Developer(NomadHer)' },
  { row: 522, seq: 521, name: '흑자(주)', phone: '0507-1311-4226', source: 'Official-Web(surplus.ai.kr)' },
  { row: 825, seq: 824, name: '(주)아이티존', phone: '010-2743-2020', source: 'Official-Web(itzone.biz)' },
  { row: 1156, seq: 1155, name: '(주)위클리벤처스', phone: '050-6766-0256', source: 'Official-Web(cadlingo.com)' },
  { row: 1541, seq: 1540, name: '(주)빈집빈방', phone: '1660-1701', source: 'Customer-Center(ez2jobs/bizno)' },
  { row: 2600, seq: 2599, name: '(주)나라이엔씨', phone: '010-2885-0213', source: 'GooglePlay-Developer(taptap)' },
  { row: 3058, seq: 3057, name: '(주)나라이엔씨', phone: '010-2885-0213', source: 'GooglePlay-Developer(taptap)' }
];

async function applyUpdates() {
  const targetFiles = [
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_261012_전략팀 전달.xlsx',
    'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.xlsx'
  ];

  for (const f of targetFiles) {
    console.log('\nUpdating file:', f.split('/').pop());
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(f);
    const ws = wb.worksheets[0];

    for (const item of unmaskedUpdates) {
      const row = ws.getRow(item.row);
      const cell = row.getCell(10);
      const compName = row.getCell(2).value;

      console.log(`  Row ${item.row} (${compName}) before: "${cell.value}" -> new: "${item.phone}"`);

      cell.value = item.phone;
      cell.style = {
        numFmt: cell.numFmt,
        border: cell.border,
        alignment: cell.alignment,
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
    }

    await wb.xlsx.writeFile(f);
    console.log('Saved:', f.split('/').pop());
  }

  // Update TXT
  const pTxt = 'C:/Users/lg/Desktop/Today/크레탑_부산CT산업현황_전화번호검증완료_전체3978개사.txt';
  if (fs.existsSync(pTxt)) {
    const lines = fs.readFileSync(pTxt, 'utf8').split('\n');
    for (const item of unmaskedUpdates) {
      const lineIdx = item.row - 1;
      const cols = lines[lineIdx].split('\t');
      cols[9] = item.phone;
      lines[lineIdx] = cols.join('\t');
    }
    fs.writeFileSync(pTxt, lines.join('\n'), 'utf8');
    console.log('Synchronized master TXT file.');
  }

  console.log('\nAll updates successfully applied!');
}

applyUpdates().catch(err => {
  console.error('Error applying updates:', err);
  process.exit(1);
});
