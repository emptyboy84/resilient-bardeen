const fs = require('fs');

const origCsvPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const buffer = fs.readFileSync(origCsvPath);
const text = new TextDecoder('utf-8').decode(buffer);

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

const rows = parseCSV(text);
const header = rows[0];
console.log('Header:', header);

const colCounts = {};
const blankCountsWithBizNo = {};
const totalWithBizNo = [];
const bizIdx = header.indexOf('사업자번호');

header.forEach((h, idx) => {
    blankCountsWithBizNo[h] = 0;
});

let withBiz = 0;
let withoutBiz = 0;

for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const b = (r[bizIdx] || '').replace(/["'\s-]/g, '');
    if (b.length >= 10) {
        withBiz++;
        header.forEach((h, idx) => {
            const val = (r[idx] || '').trim();
            if (!val || val === '-' || val === '') {
                blankCountsWithBizNo[h]++;
            }
        });
    } else {
        withoutBiz++;
    }
}

console.log(`Total rows: ${rows.length - 1}`);
console.log(`With BizNo: ${withBiz}`);
console.log(`Without BizNo: ${withoutBiz}`);
console.log('\nBlank counts among rows WITH BizNo:');
console.log(JSON.stringify(blankCountsWithBizNo, null, 2));

// Sample first 5 rows with BizNo to see what is blank
console.log('\nSample rows with BizNo (first 3):');
for (let i = 1; i < Math.min(4, rows.length); i++) {
    console.log(`Row ${i+1}:`, header.map((h, idx) => `${h}: "${rows[i][idx] || ''}"`).join(' | '));
}
