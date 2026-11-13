const https = require('https');

async function testEndpoints() {
    // Check if marketbz has search api
    const urls = [
        'https://marketbz.com/api/search?q=%EC%95%84%EC%9D%B4%EB%B9%84%EB%AE%A4%EC%A7%81%EB%8C%84%EC%8a%A4%EC%BD%98%ED%85%90%EC%8a%A4',
        'https://cookiedeal.io/api/search?query=%EC%95%84%EC%9D%B4%EB%B9%84%EB%AE%A4%EC%A7%81%EB%8C%84%EC%8a%A4%EC%BD%98%ED%85%90%EC%8a%A4'
    ];
    for (const u of urls) {
        https.get(u, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
        }, (res) => {
            console.log(u, '-> Status:', res.statusCode);
        }).on('error', e => console.log(u, '-> Error:', e.message));
    }
}

testEndpoints();
