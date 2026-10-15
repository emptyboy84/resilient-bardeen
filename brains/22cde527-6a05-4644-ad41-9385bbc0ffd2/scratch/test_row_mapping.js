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
console.log('Row 1 (Header):', rows[0][0], rows[0][1], rows[0][2]);
console.log('Row 2 (First data, seq was ' + rows[1][1] + '):', rows[1][0], rows[1][2]);
console.log('Row 639 (seq was ' + rows[638][1] + '):', rows[638][0], rows[638][2]);
console.log('Row 2307 (seq was ' + rows[2306][1] + '):', rows[2306][0], rows[2306][2]);
console.log('Row 2314 (seq was ' + rows[rows.length - 1][1] + '):', rows[rows.length - 1][0], rows[rows.length - 1][2]);
