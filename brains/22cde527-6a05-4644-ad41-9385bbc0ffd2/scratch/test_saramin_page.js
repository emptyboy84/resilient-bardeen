async function checkSaraminPage(csn) {
    const url = 'https://www.saramin.co.kr/zf_user/company-info/view?csn=' + encodeURIComponent(csn);
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    const html = await res.text();
    console.log('Page length:', html.length);
    // look for 사업자등록번호 or 10-digit
    const bizMatch = html.match(/\d{3}-\d{2}-\d{5}/g);
    console.log('Biz numbers found in Saramin:', bizMatch);
    // look for representative or address
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const bIdx = text.indexOf('사업자등록번호');
    if (bIdx !== -1) {
        console.log('Snippet:', text.slice(bIdx, bIdx + 300));
    }
}

checkSaraminPage('RUhMNS9vLzFpRWhUK3JWQmpuZmQ3dz09');
