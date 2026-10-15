const fs = require('fs');

async function fetchBiznoInfo(bizno) {
  try {
    const res = await fetch(`https://bizno.net/article/${bizno}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return { bizno, error: res.status };
    const html = await res.text();
    
    // Parse fields
    const data = { bizno };
    
    // Title / Company
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      data.company = titleMatch[1].replace(/[-|].*$/, '').trim();
    }
    
    // Status
    if (html.includes('폐업자')) data.status = '폐업';
    else if (html.includes('휴업자')) data.status = '휴업';
    else if (html.includes('계속사업자')) data.status = '정상';
    else data.status = '';

    // Zip code
    const zipMatch = html.match(/우편번호\s*<\/th>\s*<td[^>]*>\s*(\d{5})\s*<\/td>/i) ||
                     html.match(/우편번호[\s\S]*?(\d{5})/);
    if (zipMatch) data.zip = zipMatch[1];
    
    // Employee count
    const empMatch = html.match(/종업원수\s*<\/th>\s*<td[^>]*>\s*([^<]+)<\/td>/i) ||
                     html.match(/종업원수[\s\S]*?([0-9,]+명)/);
    if (empMatch) data.employees = empMatch[1].replace(/[^0-9]/g, '');

    // Classifications
    const daeMatch = html.match(/대분류\s*:\s*([^<\n\r]+?)(?=\s*중분류|$)/);
    const jungMatch = html.match(/중분류\s*:\s*([^<\n\r]+?)(?=\s*소분류|$)/);
    const soMatch = html.match(/소분류\s*:\s*([^<\n\r]+?)(?=\s*세분류|$)/);
    if (daeMatch) data.dae = daeMatch[1].trim();
    if (jungMatch) data.jung = jungMatch[1].trim();
    if (soMatch) data.so = soMatch[1].trim();
    
    // Industry (종목)
    const indMatch = html.match(/종\s*목\s*<\/th>\s*<td[^>]*>\s*([^<]+)<\/td>/i) ||
                     html.match(/업종\s*:\s*([^<\n\r]+)/);
    if (indMatch) data.industry = indMatch[1].trim();

    return data;
  } catch (err) {
    return { bizno, error: err.message };
  }
}

async function runTest() {
  const testBiznos = ['6090653247', '6090657239', '6090657409', '6090658771', '6090848296'];
  for (const b of testBiznos) {
    const t0 = Date.now();
    const info = await fetchBiznoInfo(b);
    console.log(`Bizno ${b} (${Date.now() - t0}ms):`, info);
  }
}

runTest();
