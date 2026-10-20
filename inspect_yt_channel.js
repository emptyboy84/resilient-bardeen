const https = require('https');

async function checkChannel() {
  const url = 'https://www.youtube.com/channel/UCoJXMt2yeOqa3km9JjIOHAQ';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await res.text();
  console.log('Channel HTML len:', html.length);
  const title = html.match(/<title>([^<]+)<\/title>/);
  console.log('Title:', title ? title[1] : 'None');
  
  // description or canonical
  const desc = html.match(/name="description" content="([^"]+)"/);
  console.log('Desc:', desc ? desc[1] : 'None');

  const phones = html.match(/(?:051|02|070|010)-[0-9]{3,4}-[0-9]{4}/g);
  console.log('Phones in channel:', phones);

  const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  console.log('Emails in channel:', emails);
}
checkChannel();
