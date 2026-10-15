const https = require('https');
const http = require('http');

function queryMCST() {
  return new Promise((resolve, reject) => {
    // book.mcst.go.kr search
    const postData = 'name=' + encodeURIComponent('작은통일');
    const req = http.request('http://book.mcst.go.kr/html/sub01.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', err => reject(err));
    });
    req.on('error', err => reject(err));
    req.write(postData);
    req.end();
  });
}

queryMCST().then(data => {
  console.log('Result len:', data.length);
  // print text
  const clean = data.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log(clean.substring(0, 1500));
}).catch(e => {
  console.error(e.message);
});
