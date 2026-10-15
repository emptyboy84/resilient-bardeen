const fs = require('fs');
const path = require('path');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

const todayDir = 'C:/Users/lg/Desktop/Today';

async function scanAllTodayFilesForMatches() {
  const masterFile = path.join(todayDir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx');
  const masterWb = new xlsx.Workbook();
  await masterWb.xlsx.readFile(masterFile);
  const masterWs = masterWb.getWorksheet('기업체 리스트') || masterWb.worksheets[0];

  const masterMap = new Map(); // name -> rowNum
  masterWs.eachRow((r, rNum) => {
    if (rNum === 1) return;
    const name = r.getCell(3).value ? String(r.getCell(3).value).trim() : '';
    if (name) masterMap.set(name, rNum);
  });

  console.log(`Master companies indexed: ${masterMap.size}`);

  const files = [
    '배현명_실사DB_18컬럼_최종검증완료.csv',
    '(데이터검증팀)실사 DB 취합_전달용_260720_기업정보.xlsx',
    '(데이터검증팀)실사_DB_배현명_1000행_전수정제_최종완벽본.xlsx'
  ];

  for (const f of files) {
    const fPath = path.join(todayDir, f);
    if (!fs.existsSync(fPath)) continue;
    let matchCount = 0;
    if (f.endsWith('.csv')) {
      const content = fs.readFileSync(fPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach(line => {
        for (const [name, rNum] of masterMap.entries()) {
          if (line.includes(name)) {
            matchCount++;
            break;
          }
        }
      });
      console.log(`[${f}]: matched lines: ${matchCount}`);
    } else {
      const wb = new xlsx.Workbook();
      await wb.xlsx.readFile(fPath);
      const ws = wb.worksheets[0];
      ws.eachRow((r, rNum) => {
        const valStr = r.values.join(' ');
        for (const [name] of masterMap.entries()) {
          if (valStr.includes(name)) {
            matchCount++;
            break;
          }
        }
      });
      console.log(`[${f}]: matched rows: ${matchCount}`);
    }
  }
}

scanAllTodayFilesForMatches().catch(console.error);
