const fs = require('fs');
const html = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/nice_www.nicebizinfo.com%2F.html', 'utf8');

const scripts = html.match(/<script[^>]*src="([^"]+)"[^>]*>/gi);
console.log('Scripts:', scripts);
