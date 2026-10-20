async function inspectDaum() {
  const query = '메이브릿지 부산';
  const res = await fetch(`https://search.daum.net/search?w=tot&q=${encodeURIComponent(query)}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });
  const text = await res.text();
  const idx = text.indexOf('070-4219-7808');
  console.log('Index of phone:', idx);
  if (idx !== -1) {
    console.log('Context around phone:');
    console.log(text.substring(Math.max(0, idx - 300), Math.min(text.length, idx + 300)));
  }
}
inspectDaum();
