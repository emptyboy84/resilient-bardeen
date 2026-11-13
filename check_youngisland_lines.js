const fs = require('fs');
const html = fs.readFileSync('youngisland_site.html', 'utf8');
const lines = html.split('\n');
lines.forEach(l => {
  if (l.includes('youngislandfilm@gmail.com') || l.includes('Contact') || l.includes('contact')) {
    if (l.length < 500) console.log(l.trim());
  }
});
