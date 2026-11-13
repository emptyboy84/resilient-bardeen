const fs = require('fs');
const html = fs.readFileSync('saramin_gdo.html', 'utf8');

// 전화번호 패턴 검색
const phoneMatches = html.match(/(?:0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}|010[-\s]?\d{4}[-\s]?\d{4})/g) || [];
console.log('Phone numbers found:', [...new Set(phoneMatches)]);

// 이메일 검색
const emailMatches = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('Emails found:', [...new Set(emailMatches)]);

// 기업 정보 섹션 텍스트 추출
const metaMatches = html.match(/<dl class="info_list">[\s\S]*?<\/dl>/gi) || [];
metaMatches.forEach(m => {
  console.log('Info list:', m.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
});

// 기타 정보
const basicInfo = html.match(/<div class="company_details">[\s\S]*?<\/div>/gi) || [];
basicInfo.forEach(b => {
  console.log('Company details:', b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
});
