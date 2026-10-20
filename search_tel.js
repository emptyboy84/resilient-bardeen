const fs = require('fs');
const html = fs.readFileSync('nice_jq5839.html', 'utf8');

// search for tel or phone in JSON or text
let idx = 0;
while ((idx = html.indexOf('tel', idx)) !== -1) {
  console.log('Match tel at ' + idx + ': ' + html.slice(Math.max(0, idx - 20), idx + 80).replace(/\s+/g, ' '));
  idx += 10;
}
idx = 0;
while ((idx = html.indexOf('phone', idx)) !== -1) {
  console.log('Match phone at ' + idx + ': ' + html.slice(Math.max(0, idx - 20), idx + 80).replace(/\s+/g, ' '));
  idx += 10;
}
