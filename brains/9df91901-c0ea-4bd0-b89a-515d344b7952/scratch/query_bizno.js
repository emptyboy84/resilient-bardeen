const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', err => resolve({ error: err }));
  });
}

const http = require('http');

async function run() {
  const fetchHttp = (url) => new Promise(resolve => {
    http.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, data: d, headers: res.headers }));
    }).on('error', err => resolve({ error: err }));
  });

  const r = await fetchHttp('http://haemirae.org');
  console.log('Status:', r.status);
  if (r.headers && r.headers.location) {
    console.log('Redirect:', r.headers.location);
  }
  if (r.data) {
    const text = r.data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('Searching terms in haemirae:');
    ['사업자', '고유번호', '등록번호', '051', '좌동', '이구창', '비전'].forEach(term => {
      const idx = text.indexOf(term);
      console.log(term, '=> idx:', idx, idx !== -1 ? text.substring(idx, idx + 100) : '');
    });
  }
}
run();
