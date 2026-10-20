async function check() {
  const q = '"010-3976-2"';
  const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const text = await res.text();
  const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const matches = clean.match(/010-3976-2[0-9]{3}/g);
  console.log('Daum matches for 010-3976-2:', matches);
  let idx = clean.indexOf('3976');
  while (idx !== -1) {
    console.log('Snippet:', clean.substring(Math.max(0, idx - 40), idx + 60));
    idx = clean.indexOf('3976', idx + 4);
  }
}
check();
