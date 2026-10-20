async function searchIncruit() {
  const q = encodeURIComponent('저스티스어드벤처');
  const url = 'https://search.incruit.com/list/search.asp?col=company&kw=' + q;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  console.log('Incruit search length:', html.length);
  const links = [...new Set(html.match(/job\.incruit\.com\/entry\/[^\s"'<>]+/g) || [])];
  console.log('Incruit links:', links);
  const compLinks = [...new Set(html.match(/company\.incruit\.com\/[^\s"'<>]+/g) || [])];
  console.log('Incruit comp links:', compLinks);
  const allMatches = [...new Set(html.match(/https?:\/\/[a-zA-Z0-9.\-_/]*incruit[a-zA-Z0-9.\-_/]*저스티스[a-zA-Z0-9.\-_/]*/g) || [])];
  console.log('All matches:', allMatches);
}
searchIncruit();
