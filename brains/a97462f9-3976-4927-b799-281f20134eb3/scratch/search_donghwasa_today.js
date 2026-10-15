const fs = require('fs');
const path = require('path');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

const todayDir = 'C:/Users/lg/Desktop/Today';

async function searchDonghwasaInTodayFiles() {
  const files = fs.readdirSync(todayDir);
  
  for (const f of files) {
    const fPath = path.join(todayDir, f);
    if (f.endsWith('.csv')) {
      try {
        const text = fs.readFileSync(fPath, 'utf8');
        if (text.includes('464-0761') || text.includes('중앙대로226번길 7-6')) {
          console.log(`Found match in CSV: ${f}`);
          const lines = text.split('\n');
          lines.forEach((line, idx) => {
            if (line.includes('464-0761') || line.includes('중앙대로226번길 7-6')) {
              console.log(`  Line ${idx+1}: ${line.trim()}`);
            }
          });
        }
      } catch (e) {}
    } else if (f.endsWith('.xlsx') && !f.includes('BACKUP') && !f.includes('tmp')) {
      try {
        const wb = new xlsx.Workbook();
        await wb.xlsx.readFile(fPath);
        wb.worksheets.forEach(ws => {
          ws.eachRow((r, rNum) => {
            const rowStr = r.values.join(' ');
            if (rowStr.includes('464-0761') || rowStr.includes('중앙대로226번길 7-6')) {
              console.log(`Found match in Excel: ${f} [Sheet: ${ws.name}, Row ${rNum}]`);
              console.log(`  Values:`, r.values);
            }
          });
        });
      } catch (e) {}
    }
  }
}

searchDonghwasaInTodayFiles().catch(console.error);
