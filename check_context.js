async function checkContext() {
  const url1 = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('저스티스어드벤처 전화번호');
  const res1 = await fetch(url1, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html1 = await res1.text();

  const phones1 = ['070-8690-2030', '070-8821-7991', '070-8861-7991'];
  console.log('--- Checking 070 phones in [저스티스어드벤처 전화번호] ---');
  for (const p of phones1) {
    const idx = html1.indexOf(p);
    if (idx !== -1) {
      console.log(`Context for ${p}:\n`, html1.substring(Math.max(0, idx - 150), Math.min(html1.length, idx + 150)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
  }

  const url2 = 'https://search.naver.com/search.naver?query=' + encodeURIComponent('센텀스카이비즈 B동 603호');
  const res2 = await fetch(url2, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html2 = await res2.text();

  const phones2 = ['051-784-4974', '051-754-3366', '051-747-7600', '051-909-0802'];
  console.log('\n--- Checking 051 phones in [센텀스카이비즈 B동 603호] ---');
  for (const p of phones2) {
    const idx = html2.indexOf(p);
    if (idx !== -1) {
      console.log(`Context for ${p}:\n`, html2.substring(Math.max(0, idx - 150), Math.min(html2.length, idx + 150)).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
  }
}
checkContext();
