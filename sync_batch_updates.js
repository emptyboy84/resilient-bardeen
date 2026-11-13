const fs = require('fs');
const ExcelJS = require('exceljs');

const targetFiles = [
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx',
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
  'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_최신동기화본.xlsx'
];

const updates = [
  { row: 734, seq: 733, name: '(주)일비랩', phone: '051-715-1018', source: '공식 웹사이트(ilbilab.com) 푸터' },
  { row: 740, seq: 739, name: '오토웍스에이아이테크(주)', phone: '051-782-1201', source: '공식 웹사이트(autoworksaitech.com) 푸터' },
  { row: 803, seq: 802, name: '(주)낭만아지트', phone: '070-8095-4353', source: '공식 서비스 사이트(myhouse.ai.kr) 푸터' },
  { row: 815, seq: 814, name: '수플랩스(주)', phone: '010-2011-0509', source: '공식 서비스 사이트(luvmarq.com) 푸터' },
  { row: 984, seq: 983, name: '(주)어썸쏘스', phone: '010-6565-6364', source: '공식 랜딩페이지 푸터' },
  { row: 1156, seq: 1155, name: '(주)위클리벤처스', phone: '050-6766-0256', source: '공식 서비스 사이트(cadlingo.com) 푸터' },
  { row: 1294, seq: 1293, name: '(주)벗님지유아이', phone: '051-637-7988', source: '스마트공장 공급기업 정부 공식 원장' }
];

async function syncUpdates() {
  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      continue;
    }
    
    console.log(`Processing ${filePath}...`);
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    const ws = wb.worksheets[0];
    
    let updatedCount = 0;
    for (const u of updates) {
      const row = ws.getRow(u.row);
      const cell = row.getCell(10); // Col 10 = 전화번호
      
      // 배현명 님 수기 입력 빨간색 폰트 체크
      const font = cell.font;
      const isRed = font && font.color && (font.color.argb === 'FFFF0000' || font.color.argb === 'FF0000');
      if (isRed) {
        console.log(`[SKIP] Row ${u.row} (${u.name}) is user red font.`);
        continue;
      }
      
      // Update cell value & style: 연초록 배경(FFC6EFCE) + 짙은 초록 볼드(FF006100)
      cell.value = u.phone;
      cell.font = {
        name: '맑은 고딕',
        size: 11,
        bold: true,
        color: { argb: 'FF006100' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC6EFCE' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      updatedCount++;
    }
    
    await wb.xlsx.writeFile(filePath);
    console.log(`Successfully updated ${updatedCount} rows in ${filePath}`);
  }
}

syncUpdates();
