async function checkShareTreats() {
  const url = 'https://bizno.net/article/6258100680';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  require('fs').writeFileSync('sharetreats.html', html, 'utf8');

  // Find table rows
  const rows = html.match(/<tr>[\s\S]*?<\/tr>/g) || [];
  for (const r of rows) {
    if (r.includes('전화번호') || r.includes('대표자') || r.includes('상호')) {
      console.log('Row:', r.replace(/\s+/g, ' '));
    }
  }
}
checkShareTreats();
