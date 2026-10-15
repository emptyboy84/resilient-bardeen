const fs = require('fs');
const https = require('https');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const list = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'strictly_verified_pass1.json'), 'utf8'));

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 8000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function enrichOne(item) {
  const html = await fetchUrl(item.source);
  if (!html) return item;
  
  // Parse table rows
  const rowMatches = html.match(/<tr>[\s\S]*?<\/tr>/gi) || [];
  for (const r of rowMatches) {
    const text = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Check tel
    if (text.includes('전화번호') && !item.foundPhone) {
      const m = text.match(/전화번호\s*([\d-]+)/);
      if (m && !m[1].includes('*')) item.foundPhone = m[1];
    }
    // Check fax
    if (text.includes('팩스번호') && !item.foundFax) {
      const m = text.match(/팩스번호\s*([\d-]+)/);
      if (m && !m[1].includes('*')) item.foundFax = m[1];
    }
    // Check establishment date
    if ((text.includes('설립일') || text.includes('등록일')) && !item.estDate) {
      const m = text.match(/(\d{4}[-.]\d{2}[-.]\d{2})/);
      if (m) item.estDate = m[1].replace(/\./g, '-');
      else {
        const m2 = text.match(/(\d{4}[-.]\d{2})/);
        if (m2) item.estDate = m2[1].replace(/\./g, '-');
      }
    }
    // Check employees
    if (text.includes('종업원수') && !item.emp) {
      const m = text.match(/(\d+)명/);
      if (m) item.emp = m[1];
    }
    // Check CEO
    if (text.includes('대표자명') && !item.foundCeo) {
      const m = text.match(/대표자명\s*([가-힣a-zA-Z\s,]+)/);
      if (m) item.foundCeo = m[1].trim();
    }
    // Check closure
    if (text.includes('폐업') && !item.closeDate) {
      const m = text.match(/(\d{4}[-.]\d{2}[-.]\d{2})/);
      if (m) {
        item.status = '폐업자';
        item.closeDate = m[1].replace(/\./g, '-');
      }
    }
  }
  return item;
}

async function run() {
  console.log('Enriching 39 companies...');
  for (let i = 0; i < list.length; i++) {
    list[i] = await enrichOne(list[i]);
  }
  
  let yearCount = 0, telCount = 0, faxCount = 0, empCount = 0, closeCount = 0;
  for (const x of list) {
    if (x.estDate) yearCount++;
    if (x.foundPhone) telCount++;
    if (x.foundFax) faxCount++;
    if (x.emp) empCount++;
    if (x.closeDate) closeCount++;
  }
  console.log('After enrichment:');
  console.log('estDate count:', yearCount);
  console.log('tel count:', telCount);
  console.log('fax count:', faxCount);
  console.log('emp count:', empCount);
  console.log('closeDate count:', closeCount);
  
  fs.writeFileSync(path.join(SCRATCH_DIR, 'strictly_verified_39_enriched.json'), JSON.stringify(list, null, 2), 'utf8');
}

run();
