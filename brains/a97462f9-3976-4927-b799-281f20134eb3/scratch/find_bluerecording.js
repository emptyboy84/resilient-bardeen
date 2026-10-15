const fs = require('fs');
const readline = require('readline');

async function findBlueRecording() {
  const files = [
    'C:\\Users\\lg\\Desktop\\Today\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv',
    'C:\\Users\\lg\\Desktop\\Today\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_최종제출본.csv'
  ];

  for (const filePath of files) {
    console.log(`\n--- Checking ${filePath} ---`);
    if (!fs.existsSync(filePath)) continue;
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity
    });

    let lineNum = 0;
    let header = [];
    for await (const line of rl) {
      lineNum++;
      if (lineNum === 1) {
        header = line.split(',');
        continue;
      }
      if (line.includes('블루레코딩') || line.includes('010-9514-1435') || line.includes('9514-1435')) {
        console.log(`Found at Line ${lineNum}:`);
        const cols = line.split(',');
        cols.forEach((c, idx) => {
          if (c) console.log(`  Col ${idx} (${header[idx] || ''}): ${c}`);
        });
      }
    }
  }
}

findBlueRecording();
