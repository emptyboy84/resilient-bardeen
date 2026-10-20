async function check() {
  const q = '베러아일랜드 손기혁';
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const text = await res.text();
  const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let pos = 0;
  let count = 0;
  while ((pos = clean.indexOf('손기혁', pos)) !== -1 && count < 10) {
    console.log('Match at', pos, ':', clean.substring(Math.max(0, pos - 80), pos + 150));
    pos += 3;
    count++;
  }
}
check();
