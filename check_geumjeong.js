const https = require('https');

// geumjeong.go.kr 통신판매업 공고 검색
async function searchGeumjeong() {
    const url = 'https://www.geumjeong.go.kr/board/list.geumj?boardId=BBS_0000084&menuCd=DOM_000000104001006000&contentsSid=810';
    // search for 와츄디 on geumjeong site
    const searchUrl = 'https://www.geumjeong.go.kr/search/search.geumj?query=%EC%99%80%EC%B8%A0%EB%94%94';
    https.get(searchUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 8000
    }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
            console.log('Geumjeong search length:', data.length);
            const matches = data.match(/010[-. ]?\d{4}[-. ]?\d{4}|051[-. ]?\d{3,4}[-. ]?\d{4}/g);
            console.log('Matches:', matches);
            // print snippet around 와츄디
            const idx = data.indexOf('와츄디');
            if (idx !== -1) {
                console.log(data.slice(Math.max(0, idx - 100), Math.min(data.length, idx + 400)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
            }
        });
    });
}

searchGeumjeong();
