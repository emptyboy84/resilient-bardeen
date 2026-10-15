const fs = require('fs');
const path = require('path');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

const targetNames = [
  '오픈와이즈',
  '인디페이퍼',
  '부산일보 사직지국',
  '대명기획',
  '지플러스디자인',
  '우둥불',
  '삼수니 다락방',
  '그린토이나라',
  '규성애드',
  '씨오에스피',
  '원스튜디오'
];

const targetFiles = [
  '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv',
  '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx',
  '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑!!.xlsx',
  '사업자번호_찾은_192개.xlsx',
  '사업자번호_찾은_192개_매출액포함.xlsx',
  '비즈노_500개_기업정보_16개열_정제완료.xlsx'
];

async function check() {
  const dir = 'C:/Users/lg/Desktop/Today';
  for (const f of targetFiles) {
    const fullPath = path.join(dir, f);
    if (!fs.existsSync(fullPath)) continue;
    if (f.endsWith('.csv')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach((line, idx) => {
        for (const name of targetNames) {
          if (line.includes(name)) {
            console.log(`[CSV ${f} L${idx + 1}] Found ${name}: ${line.trim()}`);
          }
        }
      });
    } else {
      const wb = new xlsx.Workbook();
      await wb.xlsx.readFile(fullPath);
      wb.eachSheet(ws => {
        ws.eachRow((r, rIdx) => {
          const str = JSON.stringify(r.values);
          for (const name of targetNames) {
            if (str && str.includes(name)) {
              console.log(`[XLSX ${f} | ${ws.name} R${rIdx}] Found ${name}: ${str}`);
            }
          }
        });
      });
    }
  }
}

check();
