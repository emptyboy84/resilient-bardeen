const fs = require('fs');

const parsedInput = JSON.parse(fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\scratch\\parsed_input.json', 'utf8')).slice(0, 58);

const full162 = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_corporate_numbers\\실사DB_162건_전체_법인번호반영.txt', 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0)
  .map(l => l.split('\t'));

console.log('Full 162 rows count:', full162.length);

// Compare parsedInput with full162 by bizNo
parsedInput.forEach((r, idx) => {
  const cleanBiz = (r.bizNo || '').replace(/[^0-9]/g, '');
  const match162 = full162.find(row => (row[3] || '').replace(/[^0-9]/g, '') === cleanBiz);
  
  if (match162) {
    const corpIn162 = match162[13] || '';
    const corpInUser = r.corpNo || '';
    if (corpIn162 !== corpInUser) {
      console.log(`[Diff CorpNo] Row ${r.rowIdx}: ${r.name} (${r.bizNo})`);
      console.log(`   User: "${corpInUser}" | Prev 162: "${corpIn162}"`);
    }
    const statusInUser = r.status || '';
    const statusIn162 = match162[1] || '';
    if (statusInUser !== statusIn162) {
      console.log(`[Diff Status] Row ${r.rowIdx}: ${r.name} (${r.bizNo})`);
      console.log(`   User: "${statusInUser}" | Prev 162: "${statusIn162}"`);
    }
  } else {
    console.log(`[Not in 162] Row ${r.rowIdx}: ${r.name} (${r.bizNo})`);
  }
});
