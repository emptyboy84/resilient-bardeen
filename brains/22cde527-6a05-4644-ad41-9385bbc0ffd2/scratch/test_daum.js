async function testDaumSearch(name, ceo, addr) {
    const query = `${name} 부산 ${ceo || ''} 사업자등록번호`.trim();
    console.log('Searching Daum:', query);
    try {
        const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(query);
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await res.text();
        const bizNumbers = html.match(/\b\d{3}-\d{2}-\d{5}\b/g);
        console.log('Biz numbers found on Daum:', bizNumbers);
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        // print any snippet containing 사업자
        const matches = text.match(/.{0,50}\d{3}-\d{2}-\d{5}.{0,50}/g);
        if (matches) {
            console.log('Matches:', matches.slice(0, 3));
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
}

testDaumSearch('모두싸인', '', '센텀스카이비즈');
testDaumSearch('블루호텔레코딩스튜디오', '김현', '장전동');
testDaumSearch('89Light', '', '충렬대로');
