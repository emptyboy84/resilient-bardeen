const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch\\bizno_sample.html', 'utf8');

// Find all matches for article
const regex = /<div class="titles">([\s\S]*?)<\/div>/gi;
let match;
let i = 0;
while ((match = regex.exec(html)) !== null) {
    i++;
    console.log(`--- Result ${i} ---`);
    console.log(match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// Check the surrounding block of each article link
const linkRegex = /<a\s+href="\/article\/(\d{10})"[^>]*>([\s\S]*?)<\/a>([\s\S]*?)(?=<a\s+href="\/article|\n\s*<div class="footer|\$)/gi;
let linkMatch;
let j = 0;
while ((linkMatch = linkRegex.exec(html)) !== null) {
    j++;
    console.log(`\n=== Card ${j} ===`);
    console.log('BizNo (from link):', linkMatch[1]);
    console.log('Title:', linkMatch[2].replace(/<[^>]+>/g, '').trim());
    console.log('Body:', linkMatch[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300));
}
