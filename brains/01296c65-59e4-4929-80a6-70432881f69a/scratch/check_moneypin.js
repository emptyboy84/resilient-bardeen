const fs = require('fs');

const html = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/01296c65-59e4-4929-80a6-70432881f69a/scratch/naver_res.html', 'utf-8');

const regex = /href="(https:\/\/moneypin\.biz\/bizno\/detail\/[^"]+)"/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log('Moneypin URL:', match[1]);
  const start = match.index;
  console.log('Context:', html.substring(start, start + 600).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
