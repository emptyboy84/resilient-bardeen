const https = require('https');

async function inspectBlogPhones() {
  const url = 'https://blog.naver.com/PostList.naver?blogId=wjdgusal48&widgetTypeCall=true&noTrackingCode=true&directAccess=true';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  ['010-6886-0406', '051-782-0415'].forEach(ph => {
    let idx = text.indexOf(ph);
    while (idx !== -1) {
      console.log('--- HIT ' + ph + ' ---');
      console.log(text.slice(Math.max(0, idx - 100), idx + 200));
      idx = text.indexOf(ph, idx + 1);
    }
  });
}
inspectBlogPhones();
