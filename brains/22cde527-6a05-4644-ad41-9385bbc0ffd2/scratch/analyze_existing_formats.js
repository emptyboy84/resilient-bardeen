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

console.log('=== Column-by-Column Format Analysis ===\n');

header.forEach((h, colIdx) => {
    if (!h) return;
    const values = [];
    for (let i = 1; i < rows.length; i++) {
        const val = (rows[i][colIdx] || '').trim();
        if (val) values.push(val);
    }

    // Sample distinct patterns
    const sampleSet = [...new Set(values)].slice(0, 15);
    console.log(`[Col ${colIdx}] "${h}": Non-empty ${values.length}/${rows.length - 1}`);
    console.log('   Samples:', sampleSet.slice(0, 8));
    
    // Check specific types
    if (h.includes('사업자번호')) {
        const hyphenCount = values.filter(v => /^\d{3}-\d{2}-\d{5}$/.test(v)).length;
        const noHyphen = values.filter(v => /^\d{10}$/.test(v)).length;
        console.log(`   Pattern: XXX-XX-XXXXX (${hyphenCount}), 10-digits (${noHyphen}), other (${values.length - hyphenCount - noHyphen})`);
    } else if (h.includes('설립연도(연도)')) {
        console.log(`   Pattern: e.g. 4-digit year?`, values.slice(0, 5));
    } else if (h.includes('설립연도(월)')) {
        console.log(`   Pattern: e.g. 1-12 or 01-12?`, values.slice(0, 5));
    } else if (h.includes('폐업 날짜')) {
        console.log(`   Pattern: e.g. YYYY-MM-DD?`, values.slice(0, 5));
    } else if (h.includes('컨택결과')) {
        console.log(`   Distinct values:`, [...new Set(values)]);
    } else if (h.includes('비고')) {
        console.log(`   Distinct values:`, [...new Set(values)].slice(0, 10));
    } else if (h.includes('매출액')) {
        console.log(`   Pattern: e.g. numbers with commas or plain?`, values.slice(0, 5));
    } else if (h.includes('시군구')) {
        console.log(`   Distinct values:`, [...new Set(values)]);
    }
    console.log('');
});
