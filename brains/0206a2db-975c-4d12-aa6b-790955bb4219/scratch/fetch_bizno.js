const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching bizno for 8985800242...');
  const res = await fetchUrl('https://bizno.net/article/8985800242');
  console.log('Status:', res.status);
  console.log('Body length:', res.body.length);
  const match = res.body.match(/<title>([^<]+)<\/title>/);
  console.log('Title:', match ? match[1] : 'No title');
  const desc = res.body.match(/<meta name="description" content="([^"]+)"/);
  console.log('Description:', desc ? desc[1] : 'No desc');
  
  if (res.body.includes('투투') || res.body.includes('서현석')) {
    console.log('Found company details in body!');
  } else {
    console.log('Company name not found directly in body.');
  }

  // Also try searching on bizno
  console.log('\nSearching bizno for query=8985800242...');
  const searchRes = await fetchUrl('https://bizno.net/?query=8985800242');
  console.log('Search status:', searchRes.status);
  const searchTitle = searchRes.body.match(/<title>([^<]+)<\/title>/);
  console.log('Search title:', searchTitle ? searchTitle[1] : 'No title');
  if (searchRes.body.includes('8985800242') || searchRes.body.includes('898-58-00242')) {
    console.log('Found in search results!');
  }
}

main().catch(console.error);
