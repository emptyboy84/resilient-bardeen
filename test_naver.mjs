import https from 'https';

const query = encodeURIComponent('경남 거제시 장평3로 80');
const url = `https://map.naver.com/v5/api/search?caller=pcweb&query=${query}&type=all&page=1&displayCount=20&lang=ko`;

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://map.naver.com/'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            console.log(data.substring(0, 500));
            const json = JSON.parse(data);
            console.log("Success! Items:", json.result?.place?.list?.length || 0);
            if (json.result?.place?.list) {
                for (let i=0; i<3; i++) {
                    const item = json.result.place.list[i];
                    if (item) console.log(item.name, item.tel, item.address);
                }
            }
        } catch(e) {
            console.error("Parse error", e.message);
        }
    });
}).on('error', e => console.error(e));
