import https from 'https';

async function searchAddress(addr) {
    return new Promise((resolve) => {
        const url = `https://search.map.kakao.com/mapsearch/map.daum?callback=cb&q=${encodeURIComponent(addr)}&msFlag=A&sort=0`;
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://map.kakao.com/'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const jsonStr = data.replace(/^cb\(/, '').replace(/\);?$/, '');
                    resolve(JSON.parse(jsonStr));
                } catch (e) {
                    console.log('Error parsing:', e);
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

searchAddress('경남 거제시 장평3로 80 (장평동)').then(console.log);
