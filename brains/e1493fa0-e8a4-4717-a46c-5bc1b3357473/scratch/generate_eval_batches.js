const fs = require('fs');

const all = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/companies_to_query.json', 'utf-8'));

function makeCode(startIdx, endIdx) {
  const slice = all.slice(startIdx, endIdx);
  const jsonStr = JSON.stringify(slice);
  
  return `async () => {
  const nuxt = window.useNuxtApp();
  const pinia = nuxt.$pinia || nuxt.vueApp.config.globalProperties.$pinia;
  const store = pinia._s.get('searchStore');
  const list = ${jsonStr};

  async function queryNice(keyword) {
    if (!keyword) return { keyword, totalCount: 0, results: [] };
    store.isFetched = false;
    const input = document.querySelector('input[placeholder*="기업명"]');
    input.value = keyword;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Press Enter
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));

    // Wait until isFetched is true
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 100));
      if (store.isFetched && store.searchKeyword === keyword) break;
    }

    return {
      keyword,
      totalCount: store.totalCount || 0,
      results: (store.searchResultList || []).map(r => ({
        bizno: r.bizno,
        name: r.korentrnm,
        rep: r.korreprnm,
        addr: r.koraddr,
        industry: r.sanupscd_kor
      }))
    };
  }

  const output = [];
  for (const item of list) {
    let res = await queryNice(item.bizno);
    let match = null;
    let source = 'bizno';

    if (res.results && res.results.length > 0) {
      match = res.results[0];
    } else if (item.name) {
      // Fallback to searching by company name
      res = await queryNice(item.name);
      if (res.results && res.results.length === 1) {
        match = res.results[0];
        source = 'name_exact';
      } else if (res.results && res.results.length > 1) {
        // match by rep or region
        const byRep = res.results.find(r => item.rep && r.rep && (r.rep.includes(item.rep) || item.rep.includes(r.rep)));
        if (byRep) {
          match = byRep;
          source = 'name_rep_match';
        } else {
          const byRegion = res.results.find(r => r.addr && (r.addr.includes('경남') || r.addr.includes('창원') || r.addr.includes('김해') || r.addr.includes('함안')));
          if (byRegion) {
            match = byRegion;
            source = 'name_region_match';
          }
        }
      }
    }

    output.push({
      idx: item.idx,
      rawBizno: item.bizno,
      rawName: item.name,
      found: !!match,
      industry: match ? match.industry : '',
      matchedName: match ? match.name : '',
      matchedRep: match ? match.rep : '',
      matchedAddr: match ? match.addr : '',
      source: match ? source : 'not_found'
    });

    await new Promise(r => setTimeout(r, 100));
  }

  return output;
}`;
}

fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/code_batch_1.js', makeCode(0, 50), 'utf-8');
fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/code_batch_2.js', makeCode(50, 100), 'utf-8');
fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/code_batch_3.js', makeCode(100, 150), 'utf-8');
fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/e1493fa0-e8a4-4717-a46c-5bc1b3357473/scratch/code_batch_4.js', makeCode(150, 200), 'utf-8');
console.log('Created code_batch_1.js to code_batch_4.js');
