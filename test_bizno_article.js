async function testArticle() {
  const bizNo = '7088100933'; // 케어닥
  const url = 'https://bizno.net/article/' + bizNo;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);
  require('fs').writeFileSync('article_7088100933.html', html, 'utf8');

  // Parse table or elements
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<title>(.*?)<\/title>/i);
  console.log('Title:', titleMatch ? titleMatch[1].trim() : 'N/A');

  // Search for phone patterns
  const phonePattern = /(?:0\d{1,2}-\d{3,4}-\d{4}|1\d{3,4}-\d{4})/g;
  const phones = html.match(phonePattern);
  console.log('Found phones:', phones);
}
testArticle();
