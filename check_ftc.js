const https = require('https');

https.get('https://www.ftc.go.kr/bizCommPop.do?wrkr_no=5941302032', {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 8000
}, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log(data);
    });
});
