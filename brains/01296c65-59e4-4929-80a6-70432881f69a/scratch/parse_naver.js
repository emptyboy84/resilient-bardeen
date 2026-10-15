const fs = require('fs');

const html = fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/01296c65-59e4-4929-80a6-70432881f69a/scratch/naver_res.html', 'utf-8');

// Find all links or titles
const regex = /<a[^>]*class="[^"]*title_link[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
let match;
console.log('--- Results for "스튜디오비오" ---');
while ((match = regex.exec(html)) !== null) {
  console.log(match[1].replace(/<[^>]+>/g, '').trim());
}

// Also check description snippets
const dRegex = /<div[^>]*class="[^"]*dsc_link[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
while ((match = dRegex.exec(html)) !== null) {
  console.log('Snippet:', match[1].replace(/<[^>]+>/g, '').trim());
}
