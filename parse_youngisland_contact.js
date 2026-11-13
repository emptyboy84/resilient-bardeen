const fs = require('fs');
const html = fs.readFileSync('youngisland_site.html', 'utf8');
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const contactIdx = text.toLowerCase().indexOf('contact');
if (contactIdx !== -1) {
  console.log('Around contact:\n', text.substring(contactIdx, contactIdx + 600));
}
const footerIdx = text.lastIndexOf('영아일랜드');
if (footerIdx !== -1) {
  console.log('Around footer:\n', text.substring(footerIdx - 100, footerIdx + 300));
}
