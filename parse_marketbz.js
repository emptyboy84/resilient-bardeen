const https = require('https');

https.get('https://marketbz.com/companyDetail/1520502134', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Check __NEXT_DATA__
    const nextMatch = d.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (nextMatch) {
      const data = JSON.parse(nextMatch[1]);
      console.log('Props keys:', Object.keys(data.props || {}));
      console.log('pageProps:', JSON.stringify(data.props.pageProps || {}).slice(0, 1500));
    } else {
      console.log('No __NEXT_DATA__');
      // search for text
      const clean = d.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      console.log(clean.slice(0, 1000));
    }
  });
});
