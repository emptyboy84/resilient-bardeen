async function test() {
    const res = await fetch('https://bizno.net/article/3568700243');
    const html = await res.text();
    console.log('Title match:', html.match(/<title>([^<]+)<\/title>/i)?.[1]);
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const addrM = text.match(/회사주소\s*:\s*([^"]+?)(?=\s*\(우|\s*대표자|\s*사업자등록번호|\s*종업원수|\s*설립일|\s*$)/);
    console.log('Address match:', addrM ? addrM[1].trim() : 'none');
    console.log('Full address snippet:', text.slice(text.indexOf('회사주소'), text.indexOf('회사주소') + 200));
}

test();
