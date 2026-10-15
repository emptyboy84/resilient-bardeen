const fs = require('fs');
const content = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/6740dd59-eb21-4d68-9720-ce1a0bd30a53/.system_generated/steps/364/content.md', 'utf8');

const lines = content.split('\n');
for (const line of lines) {
  if (line.includes('사원수') || line.includes('매출액') || line.includes('설립일') || line.includes('대표자') || line.includes('업종') || line.includes('기업구분')) {
    console.log(line.trim());
  }
}
