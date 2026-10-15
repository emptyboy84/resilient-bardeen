const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\9afeeeb7-b0d5-4db0-ab00-3b07b8fb333e\\.system_generated\\steps\\492\\content.md', 'utf8');

// Look for category or business type
const m = content.match(/"category":"([^"]+)"/g);
console.log('Category matches:', m);

const m2 = content.match(/"businessCategory":"([^"]+)"/g);
console.log('businessCategory matches:', m2);

const m3 = content.match(/"categoryName":"([^"]+)"/g);
console.log('categoryName matches:', m3);

const m4 = content.match(/"categories":\[([^\]]+)\]/g);
console.log('categories matches:', m4);

const m5 = content.match(/"commonAddress":"([^"]+)"/g);
console.log('commonAddress matches:', m5);

const m6 = content.match(/"roadAddress":"([^"]+)"/g);
console.log('roadAddress matches:', m6);

const m7 = content.match(/"name":"([^"]+)"/g);
console.log('name matches:', m7 ? m7.slice(0, 10) : null);
