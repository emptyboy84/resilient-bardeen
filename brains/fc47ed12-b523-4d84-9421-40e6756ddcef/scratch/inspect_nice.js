const fs = require('fs');

const files = fs.readdirSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch').filter(f => f.startsWith('nice_'));

files.forEach(file => {
  const content = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/' + file, 'utf8');
  console.log(`=== File: ${file} (len ${content.length}) ===`);
  // look for company list, table, or forms
  const bodyText = content.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1000);
  console.log(bodyText);
});
