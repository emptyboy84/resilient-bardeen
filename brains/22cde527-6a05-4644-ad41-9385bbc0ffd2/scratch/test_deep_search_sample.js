const fs = require('fs');
const https = require('https');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const blanks = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'exact_blanks_229.json'), 'utf8'));

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      },
      timeout: 6000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function isValidBizNo(b) {
  if (!b) return false;
  const clean = b.replace(/[^0-9]/g, '');
  if (clean.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number(clean[i]) * weights[i];
  const d9 = Number(clean[8]) * 5;
  sum += Math.floor(d9 / 10) + (d9 % 10);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(clean[9]);
}

async function searchNaver(query) {
  const url = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(query)}`;
  const html = await fetchUrl(url);
  if (!html) return [];
  
  const matches = html.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
  const valid = [];
  for (const m of matches) {
    if (isValidBizNo(m) && !valid.includes(m)) valid.push(m);
  }
  return { valid, html };
}

async function test() {
  const sample = blanks.filter(b => b.phone && b.address).slice(0, 10);
  for (const comp of sample) {
    console.log(`\n--- Row ${comp.rowNumber}: [${comp.name}] | Phone: ${comp.phone} | CEO: ${comp.ceo} | Addr: ${comp.address} ---`);
    
    // 1. Search Naver by phone
    const resPhone = await searchNaver(`"${comp.phone}"`);
    console.log(`Naver by Phone [${comp.phone}] found:`, resPhone.valid);
    
    // 2. Search Naver by name + address words
    const addrWord = comp.address.split(' ')[1] || '';
    const resName = await searchNaver(`"${comp.name}" ${addrWord} 사업자등록번호`);
    console.log(`Naver by Name+Addr [${comp.name} ${addrWord}] found:`, resName.valid);
  }
}

test();
