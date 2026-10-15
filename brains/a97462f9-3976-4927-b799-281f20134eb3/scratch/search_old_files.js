const fs = require('fs');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

const targetNames = ['오픈와이즈', '인디페이퍼', '사직지국', '대명기획', '지플러스디자인', '우둥불', '삼수니', '그린토이나라', '규성애드', '씨오에스피'];

async function searchInOldFiles() {
  const dir = 'C:/Users/lg/Desktop/Today';
  const files = fs.readdirSync(dir);

  for (const f of files) {
    if (!f.endsWith('.csv') && !f.endsWith('.xlsx')) continue;
    if (f.startsWith('~$')) continue;

    const fullPath = dir + '/' + f;
    try {
      if (f.endsWith('.csv')) {
        const text = fs.readFileSync(fullPath, 'utf8');
        targetNames.forEach(tn => {
          if (text.includes(tn)) {
            const lines = text.split('\n');
            lines.forEach((l, lIdx) => {
              if (l.includes(tn)) {
                console.log(`[CSV ${f} Line ${lIdx+1}] ${l.trim().substring(0, 120)}`);
              }
            });
          }
        });
      } else if (f.endsWith('.xlsx') && f.includes('배현명') && !f.includes('1000')) {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(fullPath);
        wb.worksheets.forEach(ws => {
          ws.eachRow((r, rNum) => {
            const rowStr = JSON.stringify(r.values);
            targetNames.forEach(tn => {
              if (rowStr.includes(tn)) {
                console.log(`[XLSX ${f} | ${ws.name} R${rNum}] ${rowStr.substring(0, 120)}`);
              }
            });
          });
        });
      }
    } catch(e) {
      // ignore
    }
  }
}

searchInOldFiles().catch(console.error);
