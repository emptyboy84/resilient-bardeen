const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\9afeeeb7-b0d5-4db0-ab00-3b07b8fb333e\\.system_generated\\steps\\492\\content.md', 'utf8');

const desc = content.match(/"description":"([^"]+)"/g);
console.log('Descriptions:', desc);

const menus = content.match(/"name":"([^"]+)"/g);
console.log('Names/Menus:', menus ? menus.slice(0, 20) : null);

const tel = content.match(/"phone":"([^"]+)"/g);
console.log('Phone:', tel);
