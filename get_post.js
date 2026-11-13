const https = require('https');

const postUrl = 'https://lll.geumjeong.go.kr/board/view.geumj?boardId=BBS_0000047&menuCd=DOM_000000124001002000&dataSid=976903';

https.get(postUrl, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 8000
}, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Title/Content snippet:');
        const titleMatch = data.match(/<h\d[^>]*>(.*?)<\/h\d>/i);
        if (titleMatch) console.log('Title:', titleMatch[1].replace(/<[^>]+>/g, '').trim());
        
        // Find file download links
        const fileLinks = data.match(/href="([^"]*fileDownload[^"]*)"/gi);
        console.log('File links:', fileLinks);
    });
}).on('error', e => console.log('Error:', e.message));
