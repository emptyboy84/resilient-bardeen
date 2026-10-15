const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_isomin_business_data/node_modules/exceljs');
const fs = require('fs');

async function searchFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log('Searching', filePath);
  try {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(filePath);
    for (const ws of wb.worksheets) {
      ws.eachRow((r, i) => {
        const str = JSON.stringify(r.values);
        if (str.includes('이소민') || str.includes('2801-2662') || str.includes('분포로 113') || str.includes('콘텐츠솔루션')) {
          console.log(`[MATCH] ${filePath} | ${ws.name} | Row ${i}:`, JSON.stringify(r.values));
        }
      });
    }
  } catch (err) {
    console.error('Error reading', filePath, err.message);
  }
}

async function main() {
  const targetFiles = [
    'C:/Users/lg/Desktop/오늘/인공지능으로찾을거.xlsx',
    'C:/Users/lg/Desktop/오늘/인공지능으로찾은거.xlsx',
    'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx',
    'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx',
    'C:/Users/lg/Desktop/오늘/사업자번호_찾은_192개.xlsx'
  ];
  for (const f of targetFiles) {
    await searchFile(f);
  }
}
main().catch(console.error);
