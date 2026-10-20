async function downloadSearchJs() {
  const res = await fetch('https://www.114.co.kr/pc/js/search/normal/search.js', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const text = await res.text();
  const matches = text.match(/(?:\/search\/[a-zA-Z0-9_\/.]+|\/api\/[a-zA-Z0-9_\/.]+)/g);
  console.log('Path matches:', matches);
  const formAction = text.match(/action\s*=\s*["'][^"']+["']/g);
  console.log('Form actions:', formAction);
}
downloadSearchJs();
