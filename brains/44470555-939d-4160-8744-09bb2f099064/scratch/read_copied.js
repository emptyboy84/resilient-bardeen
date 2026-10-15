const fs = require('fs');
const path = require('path');

const scratch = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\44470555-939d-4160-8744-09bb2f099064\\scratch';

function parseSessionFile(filename) {
    const filePath = path.join(scratch, filename);
    if (!fs.existsSync(filePath)) return;
    const buf = fs.readFileSync(filePath);
    console.log(`\n========================================`);
    console.log(`Parsing ${filename} (${buf.length} bytes)`);
    console.log(`========================================`);

    // Extract URLs
    const asciiStr = buf.toString('latin1');
    const urlMatches = asciiStr.match(/https?:\/\/[^\s\x00-\x1F\x7F-\x9F"<>{}|\\^`]+/g) || [];
    
    // Filter & Deduplicate URLs
    const cleanUrls = [];
    for (const u of urlMatches) {
        if (!u.includes('edge.microsoft.com') && 
            !u.includes('data:image') &&
            !u.endsWith('.js') && 
            !u.endsWith('.css') && 
            !u.endsWith('.woff') && 
            !u.endsWith('.woff2') &&
            !u.endsWith('.svg') &&
            !u.endsWith('.png') &&
            !u.endsWith('.jpg') &&
            !u.endsWith('.ico')) {
            cleanUrls.push(u);
        }
    }

    console.log(`--- Extracted URLs (Total unique: ${new Set(cleanUrls).size}) ---`);
    const uniqueRecentUrls = Array.from(new Set(cleanUrls)).slice(-25);
    uniqueRecentUrls.forEach(u => console.log('  URL:', u));

    // Extract UTF-16LE Korean and English titles
    console.log(`\n--- Extracted Candidate Page Titles (UTF-16LE) ---`);
    const titles = new Set();
    for (let i = 0; i < buf.length - 8; i += 2) {
        let len = 0;
        while (i + len * 2 + 1 < buf.length) {
            const code = buf.readUInt16LE(i + len * 2);
            // Korean syllables: 0xAC00 - 0xD7A3, Basic Latin: 0x20 - 0x7E
            if ((code >= 0x20 && code <= 0x7E) || (code >= 0xAC00 && code <= 0xD7A3) || (code >= 0x3000 && code <= 0x303F)) {
                len++;
            } else {
                break;
            }
        }
        if (len >= 5 && len <= 120) {
            const str = buf.toString('utf16le', i, i + len * 2).trim();
            // Check if contains Korean or specific words
            if (/[가-힣]/.test(str) && !str.startsWith('http') && !str.includes('{"') && !str.includes('function') && !str.includes('var ')) {
                titles.add(str);
            }
            i += len * 2;
        }
    }

    Array.from(titles).slice(-30).forEach(t => console.log('  Title:', t));
}

// Parse copied session & tabs
parseSessionFile('Session_13432273693242804');
parseSessionFile('Tabs_13432266087143596');

// Parse History.db text
console.log(`\n========================================`);
console.log(`Parsing History.db for recent records`);
console.log(`========================================`);
const histBuf = fs.readFileSync(path.join(scratch, 'History.db'));
const histStr = histBuf.toString('utf8');

// Match recent URLs and Korean text from History.db
const histUrls = histStr.match(/https?:\/\/[^\s\x00-\x1F\x7F"<>{}|\\^`]+/g) || [];
const validHistUrls = Array.from(new Set(histUrls.filter(u => 
    !u.includes('edge.microsoft.com') && 
    !u.includes('bing.com/rewards') &&
    !u.includes('.js') &&
    !u.includes('.css') &&
    !u.includes('.woff')
))).slice(-30);

console.log('Recent unique URLs from History:');
validHistUrls.forEach(u => console.log('  Hist URL:', u));
