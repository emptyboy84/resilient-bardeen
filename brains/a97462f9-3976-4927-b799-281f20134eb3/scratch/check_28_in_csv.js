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
const parsed = parseFullCSV(content);
const header = parsed[0];
const dataRows = parsed.slice(1);

// Map by row number or company name
const csvMapByName = {};
dataRows.forEach((r, idx) => {
  const name = r[2] ? r[2].trim() : '';
  const seq = r[1];
  const rowNum = idx + 2;
  csvMapByName[name] = { rowNum, seq, r, s24: r[16], s25: r[17], biz: r[3] };
});

const sample28 = [
  '주식회사 브이드림', '디자인에코', '산마루(주)', '주식회사 클린스쿨', '(주)한스이엔지',
  '한솔교육(부산)', '비비스로지틱스', '(주)아이지오', '(주)창비부산', '새부산기독교서적센타',
  '북컬쳐(부산)', '주식회사 아트몰링리노베이션', '영풍문고 신세계 센텀시티점', '（주）교보문고 해운대 팝업스토어',
  '노블레스미디어인터내셔날부산', '케이텍', '롯데쇼핑(주)토이저러스 동부산점', '미디어CAPSULE',
  '(주)삼성출판사 롯데동래점', '주식회사 로파스튜디오', '레고스토어 (센텀시티몰점)', '야야토이',
  '또래나라', '함께가는사람들김해지점', '이소민', '주식회사 하날', '주식회사 바나나러닝'
];

sample28.forEach(name => {
  const m = csvMapByName[name];
  if (m) {
    console.log(`Found [${name}] at CSV Row ${m.rowNum} (Seq ${m.seq}): Biz=${m.biz}, S24=${m.s24}, S25=${m.s25}`);
  } else {
    console.log(`NOT found in CSV: [${name}]`);
  }
});
