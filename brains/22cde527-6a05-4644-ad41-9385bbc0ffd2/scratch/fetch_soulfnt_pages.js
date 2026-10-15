const http = require('http');

function fetchUrl(url) {
  return new Promise(resolve => {
    http.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const about = await fetchUrl('http://www.soulfnt.com/about/');
  console.log('=== ABOUT ===');
  console.log(about.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1000));

  const contact = await fetchUrl('http://www.soulfnt.com/contact/');
  console.log('\n=== CONTACT ===');
  console.log(contact.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1000));
}

run();
