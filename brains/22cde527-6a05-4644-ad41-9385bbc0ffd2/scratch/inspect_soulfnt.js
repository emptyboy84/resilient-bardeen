const http = require('http');

http.get('http://www.soulfnt.com', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    // Find footer or contact info
    const footer = d.match(/<footer[\s\S]*?<\/footer>/i);
    if (footer) {
      console.log('Footer:\n', footer[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    }
    // Find any business number in the whole page
    const m = d.match(/\d{3}[-\s]?\d{2}[-\s]?\d{5}/g) || [];
    console.log('Biz numbers in page:', m);

    // Look for links to contact or about
    const links = d.match(/href="([^"]+)"/g) || [];
    const contactLinks = links.filter(l => /contact|about|info/i.test(l));
    console.log('Contact links:', [...new Set(contactLinks)]);
  });
});
