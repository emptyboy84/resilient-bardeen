const https = require('https');

https.get('https://bselectric.co.kr/', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 5000
}, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        const matches = d.match(/(0\d{1,2}-\d{3,4}-\d{4}|1[5678]\d{2}-\d{4})/g);
        console.log('Matches:', matches);
        const footer = d.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
        if (footer) {
            console.log('Footer:', footer[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
        } else {
            console.log('Snippet:', d.slice(-600).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
        }
    });
}).on('error', e => console.log('Error:', e.message));
