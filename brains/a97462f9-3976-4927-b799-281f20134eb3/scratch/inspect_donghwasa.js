const fs = require('fs');
const readline = require('readline');

async function inspectRow() {
  const fileStream = fs.createReadStream('C:\\Users\\lg\\Desktop\\Today\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineNum = 0;
  let header = [];
  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) {
      header = line.split(',');
      console.log('Header length:', header.length);
      header.forEach((h, i) => console.log(`Col ${i}: ${h}`));
    }
    if (line.includes('동화사')) {
      console.log(`\nMatched Line ${lineNum}:`);
      const cols = line.split(',');
      cols.forEach((c, i) => {
        console.log(`  Col ${i} (${header[i] || ''}): ${c}`);
      });
    }
  }
}

inspectRow();
