const fs = require('fs');
const path = require('path');

// 1. Create .gitignore in resilient-bardeen
const gitignorePath = 'c:/Users/lg/resilient-bardeen/.gitignore';
const gitignoreContent = 'node_modules/\n*.tmp\n*.log\n.playwright-mcp/\n';
fs.writeFileSync(gitignorePath, gitignoreContent, 'utf-8');
console.log('Created .gitignore');

// 2. Create data directory and copy desktop files
const dataDir = 'c:/Users/lg/resilient-bardeen/data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const desktopDir = 'C:/Users/lg/Desktop/오늘';
const filesToCopy = [
  '(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx',
  '배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx',
  '배현명_실사DB_네이버지도_카카오맵_전화번호검증리포트.csv'
];

filesToCopy.forEach(f => {
  const src = path.join(desktopDir, f);
  if (fs.existsSync(src)) {
    const dest = path.join(dataDir, f);
    fs.copyFileSync(src, dest);
    console.log('Copied to repo data/:', f, '(' + fs.statSync(dest).size + ' bytes)');
  } else {
    console.log('File not found on desktop:', src);
  }
});
