async function testArticle(b) {
    const clean = b.replace(/[^0-9]/g, '');
    const url = 'https://bizno.net/article/' + clean;
    const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

    console.log(`=== Results for ${b} ===`);

    const estabM = text.match(/설립일[^\:]*:\s*([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/);
    console.log('설립일:', estabM ? `${estabM[1]}년 ${estabM[2]}월` : 'none');

    const ceoM = text.match(/대표자명\s*:\s*([^\s]+)/);
    console.log('대표자명:', ceoM ? ceoM[1] : 'none');

    const telM = text.match(/전화번호\s*:\s*([0-9\-]+)/);
    console.log('전화번호:', telM ? telM[1] : 'none');

    const faxM = text.match(/팩스번호\s*:\s*([0-9\-]+)/);
    console.log('팩스번호:', faxM ? faxM[1] : 'none');

    const addrM = text.match(/회사주소\s*:\s*([^"]+?)(?=\s*\(우|\s*대표자|\s*사업자등록번호|\s*종업원수|\s*설립일|\s*$)/);
    console.log('회사주소:', addrM ? addrM[1].trim() : 'none');

    const statusM = text.match(/사업자\s*현재\s*상태[^\:]*:\s*([^\s]+)/);
    console.log('상태:', statusM ? statusM[1] : 'none');

    // 폐업일자
    const closeM = text.match(/폐업일자\s*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
    console.log('폐업일자:', closeM ? closeM[1] : 'none');

    const empM = text.match(/종업원수\s*:\s*([0-9]+)명/);
    console.log('종업원수:', empM ? empM[1] : 'none');
}

async function run() {
    await testArticle('243-86-01731');
    await testArticle('605-25-68583'); // Closed company
}

run();
