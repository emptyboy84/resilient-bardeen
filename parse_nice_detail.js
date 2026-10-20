const fs = require('fs');
const content = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/bb90a3a2-40a7-4ce1-a300-23d1be6ed9f9/.system_generated/steps/1424/content.md', 'utf8');

const phones = content.match(/(?:051|02|070|031|01[016789])-[0-9]{3,4}-[0-9]{4}/g);
console.log('Phones in NICE detail:', [...new Set(phones || [])]);

const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
console.log('Total text len:', text.length);

['손정희', '센텀중앙로', '792', '전화', '팩스', '대표자', '설립일', 'kiscode'].forEach(w => {
  let idx = 0;
  while ((idx = text.toLowerCase().indexOf(w.toLowerCase(), idx)) !== -1) {
    console.log('[' + w + ']: ' + text.slice(Math.max(0, idx - 30), idx + 100));
    idx += w.length + 20;
  }
});
