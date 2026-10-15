const fs = require('fs');

async function testFetch() {
  const sampleBnos = ['5131909625', '5132200420', '5138144615', '5138531350', '5143563369', '5148634082', '5148801452', '5170900200'];
  
  for (const bno of sampleBnos) {
    try {
      const res = await fetch(`https://bizno.net/article/${bno}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const html = await res.text();
      fs.writeFileSync(`C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/bizno_${bno}.html`, html);
      console.log(`Fetched ${bno}: length ${html.length}, status ${res.status}`);
    } catch (e) {
      console.error(`Error fetching ${bno}:`, e);
    }
  }
}

testFetch();
