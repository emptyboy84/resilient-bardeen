const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const params = new URLSearchParams({
    search_area: '',
    search_state: '13',
    search_kind: '1',
    search_type: '1',
    search_word: '비전조이'
  });
  const searchUrl = 'https://book.mcst.go.kr/html/searchList.php?' + params.toString();
  console.log('Querying:', searchUrl);
  const html = await fetchUrl(searchUrl);
  
  // Find all searchView links
  const links = [...html.matchAll(/href="(searchView\.php\?[^"]+)"/g)];
  console.log('Found links:', links.map(l => l[1]));

  for (const l of links) {
    const detailUrl = 'https://book.mcst.go.kr/html/' + l[1].replace(/&amp;/g, '&');
    console.log('\n--- Detail:', detailUrl);
    const detailHtml = await fetchUrl(detailUrl);
    // strip tags or print table
    const tableMatch = detailHtml.match(/<table[\s\S]*?<\/table>/);
    if (tableMatch) {
      console.log(tableMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
  }
}

main();
