const fs = require('fs');
const content = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/6740dd59-eb21-4d68-9720-ce1a0bd30a53/.system_generated/steps/255/content.md', 'utf8');

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
