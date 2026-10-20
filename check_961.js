const https = require('https');

async function check961() {
  const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('051-961-0404');
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log(text.slice(0, 1500));
}
check961();
