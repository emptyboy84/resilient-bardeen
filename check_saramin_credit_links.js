const fs = require('fs');

async function check() {
  const url = 'https://www.saramin.co.kr/zf_user/company-info/view/csn/dzgzSUV5S1VzQ0JYTkZoQzJNRVFnZz09/company_nm/(%EC%A3%BC)%EB%8D%94%EB%B8%94%EC%9C%A0%EC%97%90%EC%8A%A4%EC%BB%B4%ED%8D%BC%EB%8B%88';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const text = await res.text();
  const nice = text.match(/nicebizinfo\.com[^"']*/gi);
  console.log('Nice matches in Saramin:', nice);
  const ked = text.match(/kedrating\.com[^"']*/gi);
  console.log('KED matches in Saramin:', ked);
  const cretop = text.match(/cretop\.com[^"']*/gi);
  console.log('Cretop matches:', cretop);
}

check();
