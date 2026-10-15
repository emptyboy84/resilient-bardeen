async function testNaver(query) {
    console.log('Querying Naver:', query);
    const url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=' + encodeURIComponent(query);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = await res.text();
        console.log('Status:', res.status, 'Length:', html.length);
        const bizNumbers = html.match(/\b\d{3}-\d{2}-\d{5}\b/g);
        console.log('Biz numbers found on Naver:', bizNumbers);
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const matches = text.match(/.{0,50}\d{3}-\d{2}-\d{5}.{0,50}/g);
        if (matches) {
            console.log('Matches:', matches.slice(0, 5));
        }
    } catch (e) {
        console.log('Naver Error:', e.message);
    }
}

testNaver('모두싸인 사업자등록번호');
testNaver('동아대학교출판부 사업자등록번호');
testNaver('토탈소프트뱅크 사업자등록번호');
