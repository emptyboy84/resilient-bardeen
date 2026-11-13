const https = require('https');

async function searchWeb(query) {
    return new Promise((resolve) => {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 8000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', () => resolve(''));
        req.on('timeout', () => { req.destroy(); resolve(''); });
    });
}

function extractSnippets(html) {
    const regex = /<a class="result__snippet[^>]*>(.*?)<\/a>/gs;
    let matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        matches.push(match[1].replace(/<[^>]+>/g, '').trim());
    }
    return matches;
}

async function run() {
    const targets = [
        '레디액션 박준영 부산 금샘로',
        '레디액션 601-09-92780',
        '왓츠비 김덕원 부산 스케일업',
        '아랫집해파리 변서영 초량중로',
        '루프노트 정현수 부산',
        '스튜디오와이비 송유빈 부산'
    ];

    for (const t of targets) {
        console.log(`=== Query: ${t} ===`);
        const html = await searchWeb(t);
        const snippets = extractSnippets(html);
        if (snippets.length === 0) {
            console.log('No results found.');
        } else {
            snippets.slice(0, 4).forEach((s, i) => console.log(`[${i+1}] ${s}`));
        }
    }
}

run();
