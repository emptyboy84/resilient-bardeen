async function testSearchHTML(name) {
    const url = 'https://bizno.net/?query=' + encodeURIComponent(name);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch\\bizno_sample.html', html, 'utf8');
    console.log('Saved bizno_sample.html, length:', html.length);
}

const fs = require('fs');
testSearchHTML('모두싸인');
