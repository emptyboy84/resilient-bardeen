async function testMulti() {
  const targets = [
    { name: '(주)쉐어트리츠', bizNo: '6258100680' },
    { name: '(주)비욘드허니컴', bizNo: '6978601767' },
    { name: '(주)온택트헬스', bizNo: '4368802020' },
    { name: '(주)에스오더', bizNo: '3558802361' },
    { name: '부산디지털자산거래소(주)', bizNo: '1518103492' }
  ];

  for (const t of targets) {
    const url = 'https://bizno.net/article/' + t.bizNo;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();
      // Match phone from table first
      const tableMatch = html.match(/전화번호<\/th>\s*<td>\s*<a href='tel:([^']+)'>/i);
      const metaMatch = html.match(/전화번호\s*:\s*([0-9\-]+)/);
      const phone = tableMatch ? tableMatch[1].trim() : (metaMatch ? metaMatch[1].trim() : '미확인');
      console.log(`${t.name} (${t.bizNo}) -> ${phone}`);
    } catch (e) {
      console.error(`${t.name} Error:`, e.message);
    }
    // Delay 500ms
    await new Promise(r => setTimeout(r, 500));
  }
}
testMulti();
