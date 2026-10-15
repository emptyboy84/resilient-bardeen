const fs = require('fs');

const dir = 'C:/Users/lg/Desktop/Today';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));

const queries = ['인디페이퍼', '사직지국', '대명기획', '우둥불', '삼수니', '그린토이나라', '오픈와이즈', '규성애드'];

queries.forEach(q => {
  console.log(`\n=== Query: ${q} ===`);
  files.forEach(f => {
    try {
      const text = fs.readFileSync(dir + '/' + f, 'utf8');
      if (text.includes(q)) {
        const lines = text.split('\n');
        lines.forEach(l => {
          if (l.includes(q)) {
            console.log(`[${f}] ${l.trim().substring(0, 140)}`);
          }
        });
      }
    } catch(e) {}
  });
});
