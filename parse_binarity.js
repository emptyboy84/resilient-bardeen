const fs = require('fs');
const js = fs.readFileSync('binarity_bundle.js', 'utf8');

const phones = js.match(/(?:0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}|010[-\s]?\d{4}[-\s]?\d{4})/g) || [];
console.log('Phones in binarity bundle:', [...new Set(phones)]);

const emails = js.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
console.log('Emails in binarity bundle:', [...new Set(emails)]);

const idx = js.indexOf('461-86-02513');
console.log('Idx of bno:', idx);
if (idx !== -1) {
  console.log('Context of bno:', js.substring(Math.max(0, idx - 300), idx + 300));
}

const idx2 = js.indexOf('노상호');
console.log('Idx of rep:', idx2);
if (idx2 !== -1) {
  console.log('Context of rep:', js.substring(Math.max(0, idx2 - 300), idx2 + 300));
}
