const fs = require('fs');
const html = fs.readFileSync('test_bizno_res.html', 'utf8');
console.log('HTML snippet:');
console.log(html.slice(0, 1500));

const links = html.match(/href="\/article\/[^"]+"/g);
console.log('Article links:', links);

const titles = html.match(/<h4[^>]*>.*?<\/h4>/gs);
console.log('H4 titles:', titles);
