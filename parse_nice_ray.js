const fs = require('fs');
const d = fs.readFileSync('nice_search_ray.html', 'utf8');
const kiscodes = d.match(/kiscode=([A-Z0-9]+)/gi) || [];
console.log('Kiscodes:', [...new Set(kiscodes)]);

// Let's search for 신기철 in the file
console.log('Includes 신기철:', d.includes('신기철'));
console.log('Includes 121:', d.includes('121-28') || d.includes('12128'));
