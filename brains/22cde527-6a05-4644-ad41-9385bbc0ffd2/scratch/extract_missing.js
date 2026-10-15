const fs = require('fs');

const filePath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const buffer = fs.readFileSync(filePath);
let text = new TextDecoder('utf-8').decode(buffer);

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
const bizIdx = header.indexOf('사업자번호');
const seqIdx = header.indexOf('순번');
const nameIdx = header.indexOf('사업체명');
const gubunIdx = header.indexOf('구분');
const ceoIdx = header.indexOf('대표자 성함');
const addrIdx = header.indexOf('주소');
const phoneIdx = header.indexOf('연락처');
const categoryIdx = header.indexOf('업종분류');

const missing = [];
for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const b = (r[bizIdx] || '').replace(/["'\s-]/g, '');
    if (!b) {
        missing.push({
            rowNumber: i + 1, // 1-indexed in sheet/file
            rowIndex: i,      // 0-indexed in parsed array
            seq: r[seqIdx],
            gubun: r[gubunIdx],
            name: r[nameIdx],
            ceo: r[ceoIdx],
            phone: r[phoneIdx],
            address: r[addrIdx],
            category: r[categoryIdx]
        });
    }
}

console.log(`Extracted ${missing.length} missing rows.`);
fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch\\missing_421.json', JSON.stringify(missing, null, 2), 'utf8');
console.log('Saved to scratch/missing_421.json');
