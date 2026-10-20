const https = require('https');

async function search(q) {
  const url = 'https://search.daum.net/search?w=tot&q=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('Query:', q, 'Len:', text.length);
  let idx = 0;
  while ((idx = text.indexOf('923-0405', idx)) !== -1) {
    console.log('Snippet:', text.slice(Math.max(0, idx - 60), idx + 100));
    idx += 10;
  }
}

async function run() {
  await search('051-923-0405');
  await search('0519230405');
  await search('923-0405');
}
run();
