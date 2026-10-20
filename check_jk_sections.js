const fs = require('fs');

async function check() {
  const url = 'https://www.jobkorea.co.kr/Recruit/GI_Read/48484633';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  // find sections
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const idx = text.indexOf('접수방법');
  if (idx !== -1) {
    console.log('접수방법:', text.substring(idx, idx + 400));
  }
  const idx2 = text.indexOf('문의처');
  if (idx2 !== -1) {
    console.log('문의처:', text.substring(idx2, idx2 + 400));
  }
  const idx3 = text.indexOf('근무지역');
  if (idx3 !== -1) {
    console.log('근무지역:', text.substring(idx3, idx3 + 400));
  }
}
check();
