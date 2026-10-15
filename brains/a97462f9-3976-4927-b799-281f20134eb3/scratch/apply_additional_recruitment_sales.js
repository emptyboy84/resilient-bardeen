const fs = require('fs');
const path = require('path');

function parseCSV(content) {
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

function toCSVLine(fields) {
  return fields.map(f => {
    if (f === null || f === undefined) return '';
    const str = String(f);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

async function applyRecruitmentSales() {
  const dir = 'C:/Users/lg/Desktop/Today';
  const csvPath = path.join(dir, '(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.csv');

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const cleanContent = csvContent.charCodeAt(0) === 0xFEFF ? csvContent.slice(1) : csvContent;
  const parsedRows = parseCSV(cleanContent);
  const header = parsedRows[0];
  const dataRows = parsedRows.slice(1);

  const newSalesUpdates = [
    {
      rowNum: 2173,
      name: '투그램시스템즈',
      s25: 667150000,
      note: '[출처: 잡코리아]'
    },
    {
      rowNum: 2068,
      name: '에듀메타',
      s25: 148630000,
      note: '[출처: 잡코리아]'
    },
    {
      rowNum: 2165,
      name: '주식회사메쉬링크',
      s24: 492280000,
      note: '[출처: 사람인]'
    },
    {
      rowNum: 2186,
      name: '주식회사인텔리코드',
      s24: 3600000000,
      s25: 2300000000,
      note: '[출처: 사람인/인크루트/캐치]'
    },
    {
      rowNum: 2078,
      name: '케이엘정보통신 주식회사 부산지점',
      s24: 103300000000,
      note: '[출처: 캐치/사람인]'
    },
    {
      rowNum: 1718,
      name: '주식회사 우리누리 사직동지점',
      s24: 6200000000,
      note: '[출처: 캐치]'
    },
    {
      rowNum: 2132,
      name: '지엠씨랩스',
      s24: 377540000,
      note: '[출처: 잡코리아/사람인]'
    },
    {
      rowNum: 1874,
      name: '주식회사 진엔터테인먼트',
      s25: 238430000,
      note: '[출처: 인크루트/사람인]'
    },
    {
      rowNum: 750,
      name: '불교방송',
      s24: 10670000000,
      note: '[출처: 잡코리아/인크루트]'
    },
    {
      rowNum: 1034,
      name: '위컴퍼니',
      s24: 288570000,
      note: '[출처: 사람인]'
    },
    {
      rowNum: 1522,
      name: '에스아이에이',
      s25: 3948000000,
      note: '[출처: 사람인/인크루트/잡코리아]'
    }
  ];

  const updateMap = new Map();
  newSalesUpdates.forEach(u => updateMap.set(u.rowNum, u));

  let appliedCount = 0;
  dataRows.forEach((r, idx) => {
    const rowNum = idx + 2;
    if (updateMap.has(rowNum)) {
      const u = updateMap.get(rowNum);
      if (u.s24) r[16] = u.s24.toLocaleString('ko-KR');
      if (u.s25) r[17] = u.s25.toLocaleString('ko-KR');
      if (u.note) {
        r[14] = r[14] ? `${r[14]} ${u.note}` : u.note;
      }
      appliedCount++;
      console.log(`Applied [Row ${rowNum}] ${u.name}: 24s=[${r[16]}], 25s=[${r[17]}], Note=[${r[14]}]`);
    }
  });

  console.log(`\nSuccessfully applied ${appliedCount} recruitment sales updates to master CSV!`);

  // Write updated CSV back
  const lines = [
    toCSVLine(header),
    ...dataRows.map(r => toCSVLine(r))
  ];
  const finalCSV = '\uFEFF' + lines.join('\r\n') + '\r\n';
  fs.writeFileSync(csvPath, finalCSV, 'utf8');
}

applyRecruitmentSales().catch(console.error);
