const https = require('https');

async function checkBlog() {
  const url = 'https://blog.naver.com/wjdgusal48';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await res.text();
  console.log('Blog HTML len:', html.length);
  // check iframe or mainFrame
  const frameMatch = html.match(/id="mainFrame"[^>]*src="([^"]+)"/);
  let mainUrl = url;
  if (frameMatch) {
    mainUrl = 'https://blog.naver.com' + frameMatch[1];
  }
  console.log('Main URL:', mainUrl);
  const res2 = await fetch(mainUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html2 = await res2.text();
  console.log('Frame HTML len:', html2.length);
  const text2 = html2.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const phones = html2.match(/(?:051|02|070|031|01[016789]|050[0-9]?)-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Phones on blog:', [...new Set(phones || [])]);
  let idx = 0;
  while ((idx = text2.indexOf('010', idx)) !== -1) {
    console.log('Snippet 010:', text2.slice(Math.max(0, idx - 40), idx + 60));
    idx += 20;
  }
  let idx2 = 0;
  while ((idx2 = text2.indexOf('051', idx2)) !== -1) {
    console.log('Snippet 051:', text2.slice(Math.max(0, idx2 - 40), idx2 + 60));
    idx2 += 20;
  }
  ['비엘', '등록번호', '정수연', '대표', '주소', '소재지', '카이저빌', '한일오르듀', '오르듀'].forEach(w => {
    let p = text2.indexOf(w);
    if (p !== -1) console.log(`[${w}]:`, text2.slice(Math.max(0, p - 30), p + 100));
  });
}
checkBlog();
