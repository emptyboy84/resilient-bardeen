const fs = require('fs');

const html = fs.readFileSync('ws_saramin_job.html', 'utf8');

// find user_content or jv_detail
const detail = html.match(/class="user_content"[\s\S]*?<\/div>/i) || html.match(/class="jv_detail"[\s\S]*?<\/div>/i);
if (detail) {
  console.log('Detail snippet:');
  console.log(detail[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1000));
}

// find if any images in user_content
const imgs = html.match(/https?:\/\/[^"'\s]+\.(?:png|jpg|jpeg)/gi) || [];
const userImgs = imgs.filter(u => u.includes('saramin.co.kr/editor') || u.includes('editor') || u.includes('user_content'));
console.log('User imgs:', userImgs);
