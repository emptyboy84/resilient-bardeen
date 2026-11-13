const https = require('https');
const blanks = require('./thursday_blanks.json');

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 7000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: d }));
    });
    req.on('error', e => resolve({ error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
  });
}

async function checkBatch(startIdx, endIdx) {
  const slice = blanks.slice(startIdx, endIdx);
  for (let i = 0; i < slice.length; i++) {
    const c = slice[i];
    const bnoClean = c.bno.replace(/-/g, '');
    const idx = startIdx + i + 1;
    console.log(`\n[${idx}/40] Row ${c.row} (Seq ${c.seq}): ${c.name} (대표: ${c.ceo}, 사업자: ${c.bno})`);

    // 1. Bizno
    const biznoRes = await fetchUrl(`https://bizno.net/article/${bnoClean}`);
    let biznoPhones = [];
    let biznoRows = [];
    if (biznoRes.data) {
      const trMatches = biznoRes.data.match(/<tr[\s\S]*?<\/tr>/gi) || [];
      for (const tr of trMatches) {
        const text = tr.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (/전화|팩스|주소|상태|대표|개업/.test(text)) {
          biznoRows.push(text);
        }
      }
      const rawPhones = biznoRes.data.match(/(?:010|051|070|02|031|052|055|15\d{2}|16\d{2}|18\d{2})[- ]?\d{3,4}[- ]?\d{4}/g) || [];
      biznoPhones = [...new Set(rawPhones.filter(p => !p.startsWith('02-1544') && !p.startsWith('1544-')))];
    }

    // 2. MarketBZ
    const mbzRes = await fetchUrl(`https://marketbz.com/companyDetail/${bnoClean}`);
    let mbzDesc = '';
    let mbzPhones = [];
    if (mbzRes.data) {
      const m = mbzRes.data.match(/"description":"([^"]+)"/);
      if (m) {
        mbzDesc = m[1];
        const rawPhones = mbzDesc.match(/(?:010|051|070|02|031|052|055|15\d{2}|16\d{2}|18\d{2})[- ]?\d{3,4}[- ]?\d{4}/g) || [];
        mbzPhones = [...new Set(rawPhones)];
      }
    }

    console.log('  Bizno rows:', biznoRows);
    console.log('  Bizno phones:', biznoPhones);
    if (mbzDesc) console.log('  MarketBZ desc:', mbzDesc.substring(0, 150));
    if (mbzPhones.length) console.log('  MarketBZ phones:', mbzPhones);

    // pause 300ms
    await new Promise(r => setTimeout(r, 300));
  }
}

const start = parseInt(process.argv[2] || '0');
const count = parseInt(process.argv[3] || '10');
checkBatch(start, start + count);
