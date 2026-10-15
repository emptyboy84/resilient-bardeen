const fs = require('fs');

async function testSaramin(name) {
    const url = 'https://www.saramin.co.kr/zf_user/search/company?searchword=' + encodeURIComponent(name);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    // find company links
    const matches = [];
    const regex = /<a\s+href="(\/zf_user\/company-info\/view\?csn=[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let m;
    while ((m = regex.exec(html)) !== null) {
        matches.push({ link: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() });
    }
    console.log(`Saramin for ${name}: found ${matches.length} companies:`, matches.slice(0, 5));
}

testSaramin('토탈소프트뱅크');
testSaramin('모두싸인');
