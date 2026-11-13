const fs = require('fs');
const html = fs.readFileSync('pohang_contract.html', 'utf8');
const links = html.match(/href="[^"]*"/gi) || [];
links.forEach(l => {
  if (l.includes('service')) console.log(l);
});
