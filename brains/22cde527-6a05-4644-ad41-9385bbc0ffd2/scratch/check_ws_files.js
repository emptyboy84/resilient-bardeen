const fs = require('fs');
const path = require('path');

const wsDir = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\fill_missing_business_numbers';
const files = fs.readdirSync(wsDir).filter(f => f.endsWith('.tsv') || f.endsWith('.csv'));

console.log('Workspace data files:', files);

// Let's sample a few lines of each file
files.forEach(file => {
    try {
        const fullPath = path.join(wsDir, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n').filter(l => l.trim().length > 0);
        console.log(`File: ${file} | Lines: ${lines.length} | Header/Sample: ${lines[0].slice(0, 100)}`);
    } catch (e) {
        console.log(`Error reading ${file}:`, e.message);
    }
});
