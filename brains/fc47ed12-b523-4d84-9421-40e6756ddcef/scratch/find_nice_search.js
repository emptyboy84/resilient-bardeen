const fs = require('fs');
const html = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/nice_www.nicebizinfo.com%2F.html', 'utf8');

// Find form tags or search functions
const forms = html.match(/<form[\s\S]*?<\/form>/gi);
console.log('Forms found:', forms ? forms.length : 0);
if (forms) {
  forms.forEach((f, i) => console.log(`Form ${i}:`, f.slice(0, 300)));
}

// Find search keyword input
const inputs = html.match(/<input[^>]*name="[^"]*"[^>]*>/gi);
console.log('Inputs:', inputs);

// Search functions
const funcs = html.match(/function\s+[a-zA-Z0-9_]*search[a-zA-Z0-9_]*\s*\([^\)]*\)[\s\S]*?\{/gi);
console.log('Search funcs:', funcs);
