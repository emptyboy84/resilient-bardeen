const https = require('https');

// Test cookiedeal.io search or company endpoint
async function testCookieDeal() {
    return new Promise((resolve) => {
        const req = https.get('https://cookiedeal.io', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
        }, (res) => {
            console.log('CookieDeal status:', res.statusCode);
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                console.log('CookieDeal length:', data.length);
                resolve();
            });
        });
        req.on('error', e => { console.log('CookieDeal error:', e.message); resolve(); });
    });
}

async function testMarketBiz() {
    return new Promise((resolve) => {
        const req = https.get('https://marketbz.com', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
        }, (res) => {
            console.log('MarketBz status:', res.statusCode);
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                console.log('MarketBz length:', data.length);
                resolve();
            });
        });
        req.on('error', e => { console.log('MarketBz error:', e.message); resolve(); });
    });
}

async function main() {
    await testCookieDeal();
    await testMarketBiz();
}

main();
