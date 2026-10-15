const fs = require('fs');
const https = require('https');

const unpopulated = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/unpopulated_271.json', 'utf8'));

// Sample first 10 with CEO and Address
const sample = unpopulated.filter(x => x.ceo && x.address).slice(0, 10);
console.log('Sample companies:', sample.map(s => `${s.rowNumber}: ${s.name} (${s.ceo}, ${s.phone}, ${s.address})`));

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function searchBizno(q) {
  const url = `https://bizno.net/?query=${encodeURIComponent(q)}`;
  const html = await fetchUrl(url);
  
  // Extract results: links like /article/1234567890
  const regex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const results = [];
  while ((match = regex.exec(html)) !== null) {
    const biznoRaw = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    results.push({ bizno: biznoRaw, text });
  }
  return { q, results, htmlLength: html.length };
}

async function run() {
  for (const comp of sample) {
    console.log(`\n--- Searching for Row ${comp.rowNumber}: [${comp.name}] CEO: [${comp.ceo}] Phone: [${comp.phone}] ---`);
    
    // 1. Search by name
    let res = await searchBizno(comp.name);
    console.log(`Query "${comp.name}": found ${res.results.length} results`);
    if (res.results.length > 0) {
      console.log('Results:', res.results.slice(0, 3));
    }
    
    // 2. Search by phone if phone exists
    if (comp.phone) {
      let resPhone = await searchBizno(comp.phone);
      console.log(`Query phone "${comp.phone}": found ${resPhone.results.length} results`);
      if (resPhone.results.length > 0) {
        console.log('Phone results:', resPhone.results.slice(0, 3));
      }
    }
  }
}

run();
