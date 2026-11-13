const fs = require('fs');
const html = fs.readFileSync('theallim.html', 'utf8');

const phones = html.match(/(?:0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}|010[-\s]?\d{4}[-\s]?\d{4})/g) || [];
console.log('Phones in theallim:', [...new Set(phones)]);

const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('Emails in theallim:', [...new Set(emails)]);

const lines = html.replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(Boolean);

lines.forEach((l, i) => {
  if (l.includes('부산') || l.includes('센텀') || l.includes('디올림엑스') || l.includes('Tel') || l.includes('02-2231-7205')) {
    console.log(lines.slice(Math.max(0, i-1), Math.min(lines.length, i+3)).join(' | '));
  }
});
