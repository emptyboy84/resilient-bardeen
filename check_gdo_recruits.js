const fs = require('fs');
const html = fs.readFileSync('saramin_gdo.html', 'utf8');
const recruitMatches = html.match(/\/zf_user\/jobs\/relay\/view\?[^"'\s>]+/gi) || [];
console.log('Recruits found:', recruitMatches);

const allLinks = html.match(/href="([^"]+)"/g) || [];
const recruitLinks = allLinks.filter(l => l.includes('jobs') || l.includes('recruit'));
console.log('Recruit links:', recruitLinks.slice(0, 10));
