const fs = require('fs');

const html = fs.readFileSync('ws_saramin_job.html', 'utf8');
const title = html.match(/<title>([^<]+)<\/title>/);
console.log('Title:', title ? title[1] : 'NONE');

const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonLd) {
  console.log('JSON-LD:', jsonLd[1]);
}

const contactArea = html.match(/class="jv_contact"[\s\S]*?<\/div>/i) || html.match(/class="contact_info"[\s\S]*?<\/div>/i);
if (contactArea) {
  console.log('Contact area:', contactArea[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
