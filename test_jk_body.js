const fs = require('fs');

const html = fs.readFileSync('ws_jobkorea.html', 'utf8');
const imgs = html.match(/https?:\/\/[^"'\s]+\.(?:png|jpg|jpeg)/gi) || [];
console.log('Upload / File Imgs:', imgs.filter(u => u.includes('file1') || u.includes('upload') || u.includes('corp')));

const iframes = html.match(/<iframe[^>]+src=["']([^"']+)["']/gi);
console.log('Iframes:', iframes);

// check gitext
const giTextMatch = html.match(/class="giText"[\s\S]*?<\/div>/i);
if (giTextMatch) console.log('giText:', giTextMatch[0]);
