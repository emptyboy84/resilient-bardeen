const https = require('https');
const http = require('http');

function getUrl(urlStr) {
    const lib = urlStr.startsWith('https') ? https : http;
    lib.get(urlStr, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 8000
    }, (res) => {
        console.log('Status:', res.statusCode, 'Location:', res.headers.location);
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            let nextUrl = res.headers.location;
            if (!nextUrl.startsWith('http')) {
                nextUrl = new URL(nextUrl, urlStr).toString();
            }
            getUrl(nextUrl);
            return;
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const phoneRegex = /(010[-. ]?\d{4}[-. ]?\d{4}|051[-. ]?\d{3,4}[-. ]?\d{4}|070[-. ]?\d{4}[-. ]?\d{4})/g;
            const matches = data.match(phoneRegex);
            console.log('Matches:', matches);
            
            const footerMatch = data.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
            if (footerMatch) {
                console.log('Footer:', footerMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
            } else {
                console.log('Body Text snippet:', data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 500));
            }
        });
    }).on('error', (e) => console.log('Error:', e.message));
}

getUrl('https://whatsb.co.kr');
