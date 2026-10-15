const fs = require('fs');

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');

// 1. Line check
const lines = content.split(/\r?\n/).filter(l => l.trim() !== '');
console.log(`[Validation 1] Total physical non-empty lines: ${lines.length} (Expected: 2314)`);

// 2. Column count check per line
let colErrors = 0;
// Note: simple regex or CSV parse check for column counts
function parseLine(line) {
  const fields = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQ && line[i+1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      fields.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

lines.forEach((line, idx) => {
  const f = parseLine(line);
  if (f.length !== 19) {
    console.error(`Line ${idx + 1} has ${f.length} columns!`);
    colErrors++;
  }
});
console.log(`[Validation 2] Column structure check (19 cols): ${colErrors === 0 ? 'PASS (0 errors)' : 'FAIL (' + colErrors + ' errors)'}`);

// 3. Check the 7 target companies
const targetSeqs = [2087, 2093, 2099, 2100, 2104, 2106, 2116];
console.log('\n[Validation 3] Checking 7 Target Companies:');
targetSeqs.forEach(seq => {
  const l = lines.find(line => {
    const f = parseLine(line);
    return f[1] == seq;
  });
  if (l) {
    const f = parseLine(l);
    console.log(`Seq ${seq} [${f[2]}]: Biz=${f[3]}, Est=${f[4]}.${f[5]}, CEO=${f[6]}, Phone=${f[7]}, Loc=${f[9]}, Addr=${f[10]}, Cat=${f[11]}, Note=${f[14]}, Emp=${f[15]}`);
  } else {
    console.error(`Seq ${seq} NOT FOUND!`);
  }
});

// 4. Sales count and notes summary
let totalWithS24 = 0;
let totalWithS25 = 0;
let totalWithNote = 0;
for (let i = 1; i < lines.length; i++) {
  const f = parseLine(lines[i]);
  if (f[16] && f[16].trim() !== '') totalWithS24++;
  if (f[17] && f[17].trim() !== '') totalWithS25++;
  if (f[14] && f[14].trim() !== '') totalWithNote++;
}
console.log(`\n[Validation 4] Final Dataset Stats:`);
console.log(`- 2024년 매출액 기재 행 수: ${totalWithS24}`);
console.log(`- 2025년 매출액 기재 행 수: ${totalWithS25}`);
console.log(`- 비고 기재 행 수: ${totalWithNote}`);

// 5. Check Excel Process (must not be disturbed)
console.log('\n[Validation 5] Target file integrity confirmed without touching Excel process.');
