async function testDirectFetch() {
  const bnos = ['5131909625', '5132200420', '5138144615', '5138531350'];
  for (const bno of bnos) {
    const res = await fetch(`https://www.nicebizinfo.com/ep/EP0100M001GE.nice?keyword=${bno}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const html = await res.text();
    console.log(`BNO: ${bno} -> status: ${res.status}, len: ${html.length}`);
    // check if 산업명 is in the html
    const indMatch = html.match(/산업명[\s\S]{1,100}?(?=대표자명|기업주소|<\/div>|<\/p>|<\/li>)/i) || html.match(/산업명/);
    console.log(`  Contains 산업명?`, !!html.includes('산업명'));
    if (html.includes('산업명')) {
      const idx = html.indexOf('산업명');
      console.log('  Snippet:', html.slice(idx - 50, idx + 150));
    }
  }
}

testDirectFetch();
