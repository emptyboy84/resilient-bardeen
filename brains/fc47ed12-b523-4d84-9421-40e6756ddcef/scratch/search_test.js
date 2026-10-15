const fs = require('fs');

async function testSearch() {
  const queries = ['5143563369', '5148634082', '5149563369', '선진정밀', '하나자산신탁'];
  
  for (const q of queries) {
    try {
      const res = await fetch(`https://bizno.net/?query=${encodeURIComponent(q)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();
      fs.writeFileSync(`C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/search_${q}.html`, html);
      
      // Look for search results
      const articles = [];
      const artRegex = /<a\s+href="(\/article\/[0-9]+)">[\s\S]*?<h4>([\s\S]*?)<\/h4>/g;
      let m;
      while ((m = artRegex.exec(html)) !== null) {
        articles.push({ link: m[1], title: m[2].replace(/<[^>]+>/g, '').trim() });
      }
      console.log(`Query "${q}": found ${articles.length} articles`, articles);
    } catch (e) {
      console.error(`Error querying ${q}:`, e);
    }
  }
}

testSearch();
