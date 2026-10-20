async function check() {
  const q = '유한책임회사 베러아일랜드';
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const text = await res.text();
  const links = text.match(/https?:\/\/[^"'\\s<>]+/g) || [];
  const valid = links.filter(l => l.includes('chungoose') || l.includes('biz') || l.includes('saramin') || l.includes('job') || l.includes('weseb'));
  console.log('Valid links:', [...new Set(valid)]);
}
check();
