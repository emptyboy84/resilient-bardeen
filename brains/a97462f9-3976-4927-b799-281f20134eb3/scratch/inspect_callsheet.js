const fs = require('fs');

const path = 'C:/Users/lg/Desktop/Today/배현명_실사DB_전화실사_통화검증_콜시트.csv';
if (fs.existsSync(path)) {
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');
  console.log('Total lines in 콜시트:', lines.length);
  lines.slice(0, 30).forEach((l, idx) => console.log(`L${idx+1}: ${l.substring(0, 100)}`));
}
