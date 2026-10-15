async function test() {
  const res = await fetch('https://www.thinkzon.com/sale_bizreport/4295807', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const buf = await res.arrayBuffer();
  const text = new TextDecoder('euc-kr').decode(buf);
  const title = text.match(/<title>([^<]*)<\/title>/);
  console.log('Title:', title ? title[1] : 'No title');
  const m = text.match(/[0-9]{6}-[0-9]{7}/g);
  console.log('Corp matches:', m);
  
  // Look for any table rows
  const rows = text.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
  if (rows) {
    rows.forEach(r => {
      const clean = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean.includes('법인') || clean.includes('사업자') || clean.includes('대표') || clean.includes('설립')) {
        console.log('Row:', clean);
      }
    });
  }
}
test();
