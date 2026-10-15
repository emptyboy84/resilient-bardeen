const fs = require('fs');
const path = require('path');

const profileDir = 'C:\\Users\\lg\\AppData\\Local\\Microsoft\\Edge\\User Data\\Profile 1';
const sessionsDir = path.join(profileDir, 'Sessions');

console.log('=== Checking Edge Sessions Directory ===');
if (fs.existsSync(sessionsDir)) {
    const files = fs.readdirSync(sessionsDir);
    files.sort((a, b) => {
        return fs.statSync(path.join(sessionsDir, b)).mtimeMs - fs.statSync(path.join(sessionsDir, a)).mtimeMs;
    });

    for (const file of files) {
        const fullPath = path.join(sessionsDir, file);
        const stat = fs.statSync(fullPath);
        console.log(`\nFile: ${file} (Size: ${stat.size} bytes, Modified: ${stat.mtime.toISOString()})`);
        
        if (stat.size > 0 && stat.size < 5 * 1024 * 1024) {
            const buf = fs.readFileSync(fullPath);
            
            // Extract UTF-16LE and UTF-8 strings
            const strAscii = buf.toString('latin1');
            
            // Regex for http / https / edge:// urls
            const urls = new Set();
            const urlRegex = /https?:\/\/[a-zA-Z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;=%]+/g;
            let match;
            while ((match = urlRegex.exec(strAscii)) !== null) {
                // Filter out common tracking / telemetry / internal asset junk
                const u = match[0];
                if (!u.includes('edge.microsoft.com') && !u.includes('telemetry') && !u.includes('.woff') && !u.includes('.svg') && !u.includes('.css') && !u.includes('.js')) {
                    urls.add(u);
                }
            }
            
            console.log(`Found ${urls.size} distinct URLs:`);
            for (const u of Array.from(urls).slice(-20)) {
                console.log(`  - ${u}`);
            }

            // Look for SNSS commands / page titles
            // In Chromium SNSS, title is stored as UTF-16LE or UTF-8
            // Let's search for UTF-16LE strings (Korean/English titles)
            const titles = new Set();
            for (let i = 0; i < buf.length - 10; i++) {
                // Check for sequence of 2-byte wide chars
                let length = 0;
                while (i + length * 2 + 1 < buf.length) {
                    const c = buf.readUInt16LE(i + length * 2);
                    if (c >= 0x20 && c <= 0xD7AF && c !== 0x7F) {
                        length++;
                    } else {
                        break;
                    }
                }
                if (length >= 4 && length <= 100) {
                    const candidate = buf.toString('utf16le', i, i + length * 2).trim();
                    if (/[가-힣a-zA-Z0-9]/.test(candidate) && !candidate.startsWith('http') && !candidate.includes('\\') && !candidate.includes('{') && !candidate.includes('/')) {
                        titles.add(candidate);
                    }
                    i += length * 2;
                }
            }
            console.log(`Sample titles/strings:`);
            for (const t of Array.from(titles).slice(-25)) {
                console.log(`  * ${t}`);
            }
        }
    }
}
