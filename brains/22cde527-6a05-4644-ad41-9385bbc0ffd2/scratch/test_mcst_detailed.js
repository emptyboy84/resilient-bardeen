const https = require('https');

function fetch(url, encoding = 'utf-8') {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (encoding === 'euc-kr') {
          const decoder = new TextDecoder('euc-kr');
          resolve(decoder.decode(buf));
        } else {
          resolve(buf.toString('utf-8'));
        }
      });
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const page = await fetch('https://book.mcst.go.kr/html/searchList.php');
  const m = page.match(/charset=([^\s"'>]+)/i);
  console.log('Page charset:', m ? m[1] : 'not specified');

  // Let's test search with '동아대'
  const url1 = 'https://book.mcst.go.kr/html/searchList.php?search_area=6260000&search_state=13&search_kind=&search_type=1&search_word=' + encodeURIComponent('동아대');
  const res1 = await fetch(url1);
  console.log('UTF-8 "동아대" includes?', res1.includes('동아대'));
  if (res1.includes('동아대')) {
    const rows = res1.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    rows.slice(1, 4).forEach(r => console.log('Row:', r.replace(/\s+/g, ' ')));
  }

  // Check form submit method on page
  console.log('Page snippet around frm:', page.match(/<form[\s\S]*?<\/form>/i)?.[0].slice(0, 500));
}

run();
