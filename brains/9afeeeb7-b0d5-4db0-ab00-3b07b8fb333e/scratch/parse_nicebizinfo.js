const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\9afeeeb7-b0d5-4db0-ab00-3b07b8fb333e\\.system_generated\\steps\\540\\content.md', 'utf8');

// remove html tags and print text around 퍼플스톤
const text = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ');

console.log('Text length:', text.length);
// search for 010, tel, phone, 양광수
const idx = text.indexOf('양광수');
if (idx !== -1) {
  console.log('Around 양광수:', text.substring(Math.max(0, idx - 300), Math.min(text.length, idx + 500)));
}

// regex for phone numbers
const phones = text.match(/01[0-9]-?[0-9]{3,4}-?[0-9]{4}/g);
console.log('Phones found:', phones);

const tels = text.match(/0[2-6][0-9]?-?[0-9]{3,4}-?[0-9]{4}/g);
console.log('Tels found:', tels);
