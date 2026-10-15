const fs = require('fs');
const readline = require('readline');

async function scan() {
  const filePath = 'C:\\Users\\lg\\Desktop\\오늘\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv';
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  let header = null;
  const authorCounts = {};
  const bhmRows = [];
  let totalNonEmpty = 0;
  let maxNonEmptyLine = 0;

  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) {
      header = line.split(',');
      continue;
    }
    const trimmed = line.trim();
    if (!trimmed || trimmed.replace(/,/g, '') === '') {
      continue;
    }
    totalNonEmpty++;
    maxNonEmptyLine = lineNum;

    // Simple parse (first column before first comma)
    const firstComma = line.indexOf(',');
    const author = firstComma !== -1 ? line.substring(0, firstComma).trim() : line.trim();
    
    authorCounts[author] = (authorCounts[author] || 0) + 1;

    if (author.includes('배현명') || line.includes('배현명')) {
      bhmRows.push({ lineNum, line });
    }
  }

  console.log(`Total non-empty lines: ${totalNonEmpty}`);
  console.log(`Max non-empty line number: ${maxNonEmptyLine}`);
  console.log('Author counts:', JSON.stringify(authorCounts, null, 2));
  console.log(`Rows with 배현명: ${bhmRows.length}`);
  if (bhmRows.length > 0) {
    console.log(`배현명 row range: line ${bhmRows[0].lineNum} to line ${bhmRows[bhmRows.length - 1].lineNum}`);
    console.log('Sample 배현명 lines:');
    bhmRows.slice(0, 5).forEach(r => console.log(`[${r.lineNum}] ${r.line.substring(0, 100)}...`));
    console.log('Last 5 배현명 lines:');
    bhmRows.slice(-5).forEach(r => console.log(`[${r.lineNum}] ${r.line.substring(0, 100)}...`));
  }
}

scan().catch(err => console.error(err));
