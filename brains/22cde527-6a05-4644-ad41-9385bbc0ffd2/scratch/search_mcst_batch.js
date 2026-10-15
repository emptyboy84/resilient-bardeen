const fs = require('fs');
const https = require('https');
const path = require('path');

const SCRATCH_DIR = 'C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch';
const blanks = JSON.parse(fs.readFileSync(path.join(SCRATCH_DIR, 'exact_blanks_229.json'), 'utf8'));

// Filter all publishing companies (category === '출판' or name includes 출판 / 도서)
const pubCompanies = blanks.filter(b => b.category === '출판' || /출판|도서|서적/.test(b.name));
console.log(`Total publishing companies to check: ${pubCompanies.length}`);

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 8000
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

function cleanHtml(s) {
  return s ? s.replace(/<[^>]+>/g, '').trim() : '';
}

async function searchMcst(name) {
  // Try full name first
  let searchWord = name.replace(/\(주\)|주식회사/g, '').trim();
  let url = `https://book.mcst.go.kr/html/searchList.php?search_area=6260000&search_state=13&search_kind=&search_type=1&search_word=${encodeURIComponent(searchWord)}`;
  let html = await fetchUrl(url);
  
  // If not found and name starts with 도서출판, try without 도서출판
  if (!html.includes('searchView.php') && searchWord.startsWith('도서출판')) {
    searchWord = searchWord.replace('도서출판', '').trim();
    if (searchWord.length >= 2) {
      url = `https://book.mcst.go.kr/html/searchList.php?search_area=6260000&search_state=13&search_kind=&search_type=1&search_word=${encodeURIComponent(searchWord)}`;
      html = await fetchUrl(url);
    }
  }

  if (!html.includes('searchView.php')) return [];

  // Extract table rows
  const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const results = [];
  for (const row of rows) {
    if (row.includes('searchView.php')) {
      const mHref = row.match(/href=["'](searchView\.php\?[^"']+)["']/i);
      const mTitle = row.match(/<a[^>]+>([\s\S]*?)<\/a>/i);
      const cols = (row.match(/<td[\s\S]*?<\/td>/gi) || []).map(cleanHtml);
      
      const title = cleanHtml(mTitle ? mTitle[1] : '');
      const href = mHref ? `https://book.mcst.go.kr/html/${mHref[1].replace(/&amp;/g, '&')}` : '';
      const kind = cols[0] || '';
      const addr = cols[2] || '';
      const state = cols[3] || '';

      results.push({ title, href, kind, addr, state });
    }
  }
  return results;
}

async function run() {
  const matches = [];
  for (let i = 0; i < pubCompanies.length; i++) {
    const comp = pubCompanies[i];
    const res = await searchMcst(comp.name);
    if (res.length > 0) {
      console.log(`[FOUND ${matches.length + 1}] Row ${comp.rowNumber}: ${comp.name} -> ${res.length} matches:`);
      res.forEach(r => console.log(`   - ${r.title} | ${r.kind} | ${r.addr} | ${r.state} | ${r.href}`));
      matches.push({ comp, mcstResults: res });
    }
    // Polite delay
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== MCST SEARCH COMPLETE ===`);
  console.log(`Matched ${matches.length} / ${pubCompanies.length} publishing companies`);
  fs.writeFileSync(path.join(SCRATCH_DIR, 'mcst_matched_publishers.json'), JSON.stringify(matches, null, 2), 'utf8');
}

run();
