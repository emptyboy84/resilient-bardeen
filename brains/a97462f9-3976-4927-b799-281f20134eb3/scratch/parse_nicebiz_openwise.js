const fs = require('fs');
const content = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/.system_generated/steps/778/content.md', 'utf8');

// Match 10 digits or 3-2-5 digits
const matches = content.match(/\d{3}-\d{2}-\d{5}/g) || [];
console.log('Matches with hyphen:', [...new Set(matches)]);

const bizMatches = content.match(/사업자[^\n<]{0,50}/g) || [];
console.log('Biz matches:', bizMatches.slice(0, 10));

// Also search around "오픈와이즈"
const idx = content.indexOf('오픈와이즈');
if (idx !== -1) {
  console.log('Around 오픈와이즈:', content.substring(Math.max(0, idx - 200), idx + 500).replace(/<[^>]+>/g, ' '));
}
