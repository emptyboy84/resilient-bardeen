const fs = require('fs');

function parseCSV(content) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentCell.trim());
            if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }
    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
    }
    return rows;
}

const text = fs.readFileSync('C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv', 'utf8');
const rows = parseCSV(text);
console.log('Total parsed rows:', rows.length);
console.log('Header length:', rows[0].length);
console.log('Header:', rows[0]);
const non19 = rows.map((r, idx) => ({ idx, len: r.length })).filter(r => r.len !== 19);
console.log('Non-19 rows count:', non19.length);
if (non19.length > 0) console.log('Sample non-19:', non19.slice(0, 5));
