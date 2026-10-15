const fs = require('fs');

async function testSources(companyName) {
    console.log(`\n================ Testing for: ${companyName} ================`);
    
    // 1. Bizno
    try {
        const bRes = await fetch('https://bizno.net/?query=' + encodeURIComponent(companyName), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const bHtml = await bRes.text();
        const bMatches = [];
        const linkRegex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>([\s\S]*?)(?=<a\s+href="\/article|\n\s*<div class="footer|\$)/gi;
        let lm;
        while ((lm = linkRegex.exec(bHtml)) !== null) {
            bMatches.push({
                bizno: lm[1],
                title: lm[2].replace(/<[^>]+>/g, '').trim(),
                snippet: lm[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150)
            });
        }
        console.log(`[Bizno] Found ${bMatches.length} results:`, bMatches);
    } catch (e) {
        console.log('[Bizno] Error:', e.message);
    }

    // 2. Saramin
    try {
        const sRes = await fetch('https://www.saramin.co.kr/zf_user/search/company?searchword=' + encodeURIComponent(companyName), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const sHtml = await sRes.text();
        console.log('[Saramin] Length:', sHtml.length, 'Contains results:', sHtml.includes('company_popup') || sHtml.includes('corp_name'));
    } catch (e) {
        console.log('[Saramin] Error:', e.message);
    }

    // 3. Catch
    try {
        const cRes = await fetch('https://www.catch.co.kr/Search/SearchList?SearchText=' + encodeURIComponent(companyName), {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const cHtml = await cRes.text();
        console.log('[Catch] Length:', cHtml.length, 'Contains comp:', cHtml.includes('CompName') || cHtml.includes('company'));
    } catch (e) {
        console.log('[Catch] Error:', e.message);
    }
}

async function run() {
    await testSources('모두싸인');
    await testSources('케어닥');
    await testSources('토탈소프트뱅크');
    await testSources('블루호텔레코딩스튜디오');
}

run();
