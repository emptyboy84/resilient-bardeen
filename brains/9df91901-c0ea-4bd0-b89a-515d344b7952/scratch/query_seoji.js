const https = require('https');

function post(url, data) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const postData = typeof data === 'string' ? data : new URLSearchParams(data).toString();
    const req = https.request(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', err => resolve({ error: err }));
    req.write(postData);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', err => resolve({ error: err }));
  });
}

async function run() {
  const r = await get('https://www.nl.go.kr/seoji/contents/S20501000000.do?searchGbn=publisher&searchWord=' + encodeURIComponent('비전조이'));
  console.log('Seoji status:', r.status);
  console.log('Seoji body:', r.body);
}
run();
