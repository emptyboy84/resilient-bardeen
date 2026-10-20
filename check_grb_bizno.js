const fs = require('fs');

async function checkBiznoCorp() {
  const corp = '1801111128312';
  const res = await fetch('https://bizno.net/?query=' + corp, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  console.log('Result len:', html.length);
  const titles = html.match(/<h4 class="titles">[\s\S]*?<\/h4>/g) || html.match(/class="titles"[\s\S]*?<\/div>/g) || [];
  console.log('Titles found:', titles.length);
  titles.forEach((t, i) => console.log(i, t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));

  const articleMatches = [...html.matchAll(/<a href="(\/article\/[0-9]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  console.log('Article links:', articleMatches.length);
  articleMatches.forEach(m => console.log(m[1], m[2].replace(/<[^>]+>/g, '').trim()));
}
checkBiznoCorp();
