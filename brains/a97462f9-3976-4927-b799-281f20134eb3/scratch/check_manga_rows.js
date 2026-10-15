const fs = require('fs');
const readline = require('readline');

async function checkMangaRows() {
  const filePath = 'C:\\Users\\lg\\Desktop\\Today\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
  const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });

  let lineNum = 0;
  let header = [];
  const mangaRows = [];

  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) {
      header = line.split(',');
      continue;
    }
    const cols = line.split(',');
    // Col 11 is 업종분류
    if (cols[11] === '만화') {
      mangaRows.push({
        lineNum,
        id: cols[1],
        name: cols[2],
        bizNo: cols[3],
        year: cols[4],
        ceo: cols[6],
        tel: cols[7],
        gu: cols[9],
        addr: cols[10],
        source: cols[18]
      });
    }
  }

  console.log(`Total '만화' rows found: ${mangaRows.length}`);
  console.log(JSON.stringify(mangaRows.slice(0, 30), null, 2));
}

checkMangaRows();
