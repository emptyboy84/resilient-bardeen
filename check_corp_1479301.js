const fs = require('fs');

async function checkCorp() {
  const corp = '1801111479301';
  console.log('--- Probing Bizno by corpNo ---');
  try {
    const res = await fetch(`https://bizno.net/?query=${corp}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    console.log('Len:', html.length);
    const titles = html.match(/<h4 class="titles">[\s\S]*?<\/h4>/g) || html.match(/class="titles"[\s\S]*?<\/div>/g) || [];
    console.log('Titles:', titles.map(t => t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));
    const articles = [...html.matchAll(/<a href="(\/article\/[0-9]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    articles.forEach(m => console.log(m[1], m[2].replace(/<[^>]+>/g, '').trim()));
  } catch(e) {
    console.log('Err:', e.message);
  }
}

checkCorp();
