const fs = require('fs');
const content = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/.system_generated/steps/786/content.md', 'utf8');

const matches = content.match(/\d{3}-\d{2}-\d{5}/g) || [];
console.log('Matches with hyphen:', [...new Set(matches)]);

const csn = content.match(/csn[^\n&"]{0,30}/g) || [];
console.log('csn matches:', csn);

// search "250-"
const p250 = content.match(/250-[0-9-]+/g) || [];
console.log('250 matches:', p250);
