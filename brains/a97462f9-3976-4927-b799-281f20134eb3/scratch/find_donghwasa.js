const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

const dir = 'C:\\Users\\lg\\Desktop\\Today';
const files = fs.readdirSync(dir);

async function search() {
  console.log('Searching in Today directory...');

  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (f.endsWith('.csv') || f.endsWith('.txt')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('동화사') || content.includes('464-0761')) {
          console.log('[MATCH CSV/TXT]', f);
          const lines = content.split('\n');
          lines.forEach((l, idx) => {
            if (l.includes('동화사') || l.includes('464-0761')) {
              console.log(`  Line ${idx+1}: ${l.trim().substring(0, 150)}`);
            }
          });
        }
      } catch (e) {}
    } else if (f.endsWith('.xlsx') && !f.startsWith('~$')) {
      try {
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.readFile(fullPath);
        wb.eachSheet((sheet, sheetId) => {
          sheet.eachRow((row, rowNumber) => {
            const values = row.values;
            const str = JSON.stringify(values);
            if (str && (str.includes('동화사') || str.includes('464-0761'))) {
              console.log(`[MATCH XLSX] ${f} | Sheet: ${sheet.name} | Row: ${rowNumber}`);
              console.log(`  Values: ${str.substring(0, 200)}`);
            }
          });
        });
      } catch (e) {}
    }
  }
}

search();
