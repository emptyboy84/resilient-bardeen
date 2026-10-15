const fs = require('fs');
const xlsx = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_undo_game_studio/node_modules/exceljs');

const files = [
  'C:/Users/lg/Desktop/Today/배현명_실사DB_전화실사_통화검증_콜시트.csv',
  'C:/Users/lg/Desktop/Today/배현명_실사DB_폐업휴업_86건_전수리포트.csv',
  'C:/Users/lg/Desktop/Today/배현명_실사DB_네이버지도_카카오맵_전화번호검증리포트.csv'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const text = fs.readFileSync(f, 'utf8');
    if (text.includes('동화사') || text.includes('464-0761') || text.includes('중앙대로226번길 7-6')) {
      console.log(`Match in ${f}:`);
      const lines = text.split('\n');
      lines.forEach(l => {
        if (l.includes('동화사') || l.includes('464-0761') || l.includes('중앙대로226번길 7-6')) {
          console.log(`  `, l.trim());
        }
      });
    }
  }
});
