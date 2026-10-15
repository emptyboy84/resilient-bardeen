const fs = require('fs');
const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf8');

const m = content.match(/summary="([^"]+)"/);
if (m) {
  console.log('SUMMARY:', m[1]);
}

const regex = /<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
let match;
while ((match = regex.exec(content)) !== null) {
  const th = match[1].replace(/<[^>]+>/g, '').trim();
  const td = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  console.log(`${th} : ${td}`);
}
