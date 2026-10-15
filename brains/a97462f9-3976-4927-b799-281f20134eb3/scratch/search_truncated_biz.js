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
  '씨오에스피'
];

const dir = 'C:/Users/lg/Desktop/Today';
const files = fs.readdirSync(dir);

async function search() {
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file.endsWith('.csv')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        for (const name of targetNames) {
          if (line.includes(name)) {
            console.log(`[CSV ${file} L${idx + 1}] Found ${name}: ${line.trim()}`);
          }
        }
      });
    } else if (file.endsWith('.xlsx') && !file.startsWith('~$')) {
      try {
        const wb = new xlsx.Workbook();
        await wb.xlsx.readFile(fullPath);
        wb.eachSheet((ws, sheetId) => {
          ws.eachRow((row, rowNumber) => {
            const vals = row.values;
            const rowStr = JSON.stringify(vals);
            for (const name of targetNames) {
              if (rowStr && rowStr.includes(name)) {
                console.log(`[XLSX ${file} | ${ws.name} R${rowNumber}] Found ${name}: ${rowStr}`);
              }
            }
          });
        });
      } catch (e) {
        // ignore read errors
      }
    }
  }
}

search();
