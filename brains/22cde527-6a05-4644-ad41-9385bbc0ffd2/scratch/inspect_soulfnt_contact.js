const http = require('http');

http.get('http://www.soulfnt.com/contact/', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const entry = d.match(/<div class="entry-content">([\s\S]*?)<\/div>/i);
    if (entry) {
      console.log('Entry content:\n', entry[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    } else {
      console.log('No entry content class found');
      // search for text around 051
      const idx = d.indexOf('051');
      if (idx !== -1) console.log(d.slice(idx - 100, idx + 200));
    }
  });
});
