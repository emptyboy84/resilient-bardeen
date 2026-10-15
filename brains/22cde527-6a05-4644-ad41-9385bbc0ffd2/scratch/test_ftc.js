async function testFTC(name) {
    try {
        const url = 'https://www.ftc.go.kr/bizCommList.do';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            body: new URLSearchParams({
                'searchtype': '1', // 1: 상호, 2: 사업자등록번호, 3: 통신판매번호, 4: 대표자
                'searchparam': name
            }).toString()
        });
        const html = await res.text();
        console.log(`[FTC] ${name} status:`, res.status, 'length:', html.length);
        const bizNumbers = html.match(/\d{3}-\d{2}-\d{5}/g);
        console.log(`[FTC] Biz numbers found:`, bizNumbers);
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
        const idx = text.indexOf(name);
        if (idx !== -1) {
            console.log(`[FTC] Snippet:`, text.slice(idx, idx + 200));
        }
    } catch (e) {
        console.log('[FTC] Error:', e.message);
    }
}

testFTC('모두싸인');
testFTC('토탈소프트뱅크');
