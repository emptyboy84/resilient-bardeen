async function test() {
  const res = await fetch('https://bizno.net/?query=1801111398329', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('Result len:', html.length);
  const titles = html.match(/<h4 class="titles">[\s\S]*?<\/h4>/g) || html.match(/class="titles"[\s\S]*?<\/div>/g) || [];
  console.log('Titles found:', titles.length);
  titles.slice(0, 5).forEach((t, i) => console.log(i, t.replace(/<[^>]+>/g, ' ').trim()));

  const articleMatches = [...html.matchAll(/<a href="(\/article\/[0-9]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  console.log('Article links:', articleMatches.length);
  articleMatches.slice(0, 5).forEach(m => console.log(m[1], m[2].replace(/<[^>]+>/g, '').trim()));
}
test();
