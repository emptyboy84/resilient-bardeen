async function testSpecific() {
    const q = encodeURIComponent('나래바람 부산 남구');
    const res = await fetch('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=' + q, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    console.log('Naver length:', html.length);
    const biz = html.match(/\b\d{3}-\d{2}-\d{5}\b/g);
    console.log('Biz matches:', biz);
}

testSpecific();
