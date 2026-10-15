const fs = require('fs');

const parsedInput = JSON.parse(fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\f2533ba2-96b2-426b-85af-73e28ca73587\\scratch\\parsed_input.json', 'utf8')).slice(0, 58);

// Corrections:
// 1. Row 35 대원오토텍: corpNo -> "" (오입력된 768-88-01307 제거)
// 2. Row 16 ㈜파리로엠엔비: corpNo -> "164811-0168886", closingMonth -> "12월" (162건 DB 기준 복원)

const cleanedRows = parsedInput.map((r, idx) => {
  const cols = [...r.cols];
  
  // ensure 18 columns
  while (cols.length < 18) {
    cols.push('');
  }

  if (r.rowIdx === 35) {
    // 대원오토텍
    cols[13] = ''; // clear wrong corp no
  }

  if (r.rowIdx === 16) {
    // ㈜파리로엠엔비
    cols[13] = '164811-0168886';
    if (!cols[14]) cols[14] = '12월';
  }

  return cols.join('\t');
});

const cleanedTsv = cleanedRows.join('\r\n');
fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\extract_corporate_numbers\\검수완료_정제DB_58건.txt', cleanedTsv, 'utf8');
console.log('Successfully wrote 검수완료_정제DB_58건.txt');
