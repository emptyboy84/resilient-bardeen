const fs = require('fs');
const html = fs.readFileSync('114_response.html', 'utf8');
console.log('Title:', (html.match(/<title>([^<]+)<\/title>/) || [])[1]);
console.log('Scripts:', [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(m => m[1]));
const nextData = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (nextData) {
  console.log('Next.js data found! Length:', nextData[1].length);
  const json = JSON.parse(nextData[1]);
  console.log('Keys in pageProps:', Object.keys(json.props?.pageProps || {}));
  console.log('Search data:', JSON.stringify(json.props?.pageProps).substring(0, 500));
}
