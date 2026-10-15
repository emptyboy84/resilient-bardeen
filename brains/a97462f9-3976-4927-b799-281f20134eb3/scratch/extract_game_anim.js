const fs = require('fs');

function parseFullCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField);
      if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.trim() !== '')) rows.push(currentRow);
  }
  return rows;
}

const csvPath = 'C:/Users/lg/Desktop/Today/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const rows = parseFullCSV(content);
const data = rows.slice(1);

const games = data.filter(r => {
  const cat = r[11] ? r[11].trim() : '';
  const s24 = r[16] ? r[16].trim() : '';
  const s25 = r[17] ? r[17].trim() : '';
  const biz = r[3] ? r[3].trim() : '';
  return ['게임', '애니메이션', '캐릭터', '방송'].includes(cat) && biz !== '' && !s24 && !s25;
});

console.log('Game/Animation/Character/Broadcasting missing sales:', games.length);
games.slice(0, 30).forEach(g => {
  console.log(`[Seq ${g[1]}] ${g[2]} | Biz: ${g[3]} | Cat: ${g[11]} | CEO: ${g[6]}`);
});
