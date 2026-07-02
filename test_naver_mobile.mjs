import https from 'https';

const query = encodeURIComponent('경남 거제시 장평3로 80');
const url = `https://m.map.naver.com/search2/search.naver?query=${query}&sm=sug&style=v5&page=1`;

https.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://m.map.naver.com/'
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            console.log(data.substring(0, 500));
            const json = JSON.parse(data);
            console.log("Success! Items:", json.result?.site?.list?.length || 0);
            if (json.result?.site?.list) {
                for (let i=0; i<3; i++) {
                    const item = json.result.site.list[i];
                    if (item) console.log(item.name, item.tel, item.address);
                }
            }
        } catch(e) {
            console.error("Parse error", e.message);
        }
    });
}).on('error', e => console.error(e));
