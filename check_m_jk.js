async function check() {
  const url = 'https://m.jobkorea.co.kr/Recruit/GI_Read/48484633';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    }
  });
  const html = await res.text();
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const idx = text.indexOf('유한책임회사');
  if (idx !== -1) {
    console.log('Mobile text:', text.substring(idx, idx + 1000));
  }
}
check();
