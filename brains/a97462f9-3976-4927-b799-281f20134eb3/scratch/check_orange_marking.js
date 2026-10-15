const fs = require('fs');

const f = 'C:/Users/lg/Desktop/Today/배현명_실사DB_14컬럼_주황색마킹_상세포함.csv';
if (fs.existsSync(f)) {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  console.log('Lines in 주황색마킹_상세포함:', lines.length);
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    console.log(`L${i+1}: ${lines[i].substring(0, 100)}`);
  }
}
