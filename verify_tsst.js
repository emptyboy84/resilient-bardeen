const https = require('https');

https.get('https://tsst.kr', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 5000
}, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        const idx = d.indexOf('010-2234-6285');
        console.log('Index of phone:', idx);
        if (idx !== -1) {
            console.log(d.slice(idx - 150, idx + 250).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
        }
    });
}).on('error', e => console.log('Error:', e.message));
