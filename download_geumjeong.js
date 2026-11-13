const https = require('https');
const fs = require('fs');

const url = 'https://lll.geumjeong.go.kr/board/fileDownload.geumj?fileSid=346284';

const file = fs.createWriteStream('geumjeong_file.xlsx');
https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 8000
}, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers['content-disposition'], res.headers['content-type']);
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('File saved. Size:', fs.statSync('geumjeong_file.xlsx').size);
    });
}).on('error', e => console.log('Error:', e.message));
