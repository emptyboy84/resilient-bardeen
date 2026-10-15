const fs = require('fs');

async function testNice() {
  const urls = [
    'https://www.nicebizinfo.com/',
    'https://www.nicebizinfo.com/cm/CM0100M001GE.nice',
    'https://www.nicebizinfo.com/ep/EP0100M002GE.nice?search_word=5131909625',
    'https://www.nicebizinfo.com/ep/EP0100M002GE.nice?search_word=룩스텍'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const text = await res.text();
      console.log(`URL: ${url} -> status: ${res.status}, len: ${text.length}`);
      fs.writeFileSync(`C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/nice_${encodeURIComponent(url.slice(-20))}.html`, text);
    } catch (e) {
      console.error(`Error for ${url}:`, e);
    }
  }
}

testNice();
