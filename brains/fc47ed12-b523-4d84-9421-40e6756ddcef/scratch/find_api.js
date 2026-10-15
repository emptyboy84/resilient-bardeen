const fs = require('fs');
const html = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/nice_www.nicebizinfo.com%2F.html', 'utf8');

const matches = html.match(/[a-zA-Z0-9_\/]+\.nice/g);
console.log('Nice endpoints:', [...new Set(matches)]);

const apiMatches = html.match(/\/api\/[a-zA-Z0-9_\/\-]+/g);
console.log('API endpoints:', [...new Set(apiMatches)]);
