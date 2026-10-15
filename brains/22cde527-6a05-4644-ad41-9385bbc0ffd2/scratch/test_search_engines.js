async function testSearchEngines(q) {
    console.log('Testing engines for:', q);

    // 1. DuckDuckGo HTML
    try {
        const ddgUrl = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
        const res = await fetch(ddgUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await res.text();
        console.log('DDG status:', res.status, 'length:', html.length);
        const biz = html.match(/\b\d{3}-\d{2}-\d{5}\b/g);
        console.log('DDG biz matches:', biz);
        const titleMatches = html.match(/<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/gi);
        if (titleMatches) {
            console.log('DDG snippets count:', titleMatches.length);
        }
    } catch (e) {
        console.log('DDG error:', e.message);
    }

    // 2. Google search
    try {
        const gUrl = 'https://www.google.com/search?q=' + encodeURIComponent(q) + '&hl=ko';
        const res = await fetch(gUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await res.text();
        console.log('Google status:', res.status, 'length:', html.length);
        const biz = html.match(/\b\d{3}-\d{2}-\d{5}\b/g);
        console.log('Google biz matches:', biz);
    } catch (e) {
        console.log('Google error:', e.message);
    }
}

testSearchEngines('토탈소프트뱅크 최장수 사업자등록번호');
