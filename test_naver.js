async function searchNaver() {
  const queries = [
    '저스티스어드벤처',
    '저스티스어드벤처 전화번호',
    '센텀스카이비즈 B동 603호',
    '조현제 저스티스어드벤처'
  ];

  for (const q of queries) {
    const url = 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const phones = html.match(/(?:051|010|070|02|1[568][0-9]{2})-[0-9]{3,4}-[0-9]{4}/g);
    console.log(`Naver [${q}] found phones:`, [...new Set(phones || [])]);
  }
}
searchNaver();
