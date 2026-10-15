const http = require('http');

http.get('http://www.soulfnt.com', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('soulfnt.com Status:', res.statusCode, 'Length:', d.length);
    const m = d.match(/\b\d{3}-\d{2}-\d{5}\b/g) || [];
    console.log('Biz matches on soulfnt.com:', [...new Set(m)]);
    const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    console.log('Snippet:\n', text.slice(0, 500));
  });
}).on('error', e => console.log('Error:', e.message));
