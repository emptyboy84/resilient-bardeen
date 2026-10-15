const fs = require('fs');
const html = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/a97462f9-3976-4927-b799-281f20134eb3/.system_generated/steps/702/content.md', 'utf8');

const regexes = [
  /csn=([A-Za-z0-9%+=_]+)/g,
  /company_cd=([A-Za-z0-9]+)/g,
  /250-?88-?\d+/g
];

regexes.forEach(r => {
  let m;
  while ((m = r.exec(html)) !== null) {
    console.log('Match:', m[0]);
  }
});
