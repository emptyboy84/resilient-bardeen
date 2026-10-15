const fs = require('fs');
const readline = require('readline');

const filePath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_여기까지했어요.csv";

function parseCSVLine(text) {
    const res = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (i + 1 < text.length && text[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                cur += c;
            }
        } else {
            if (c === '"') {
                inQuotes = true;
            } else if (c === ',') {
                res.push(cur);
                cur = '';
            } else {
                cur += c;
            }
        }
    }
    res.push(cur);
    return { fields: res, inQuotes };
}

async function deepAnalyze() {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let lineNum = 0;
    let multiline = '';
    let inQuotes = false;

    const bhmRows = [];
    const otherRows = [];
    let totalRows = 0;

    for await (const line of rl) {
        lineNum++;
        let currentLine = line;
        if (lineNum === 1 && currentLine.charCodeAt(0) === 0xFEFF) {
            currentLine = currentLine.slice(1);
        }

        if (inQuotes) {
            multiline += '\n' + currentLine;
        } else {
            multiline = currentLine;
        }

        const parsed = parseCSVLine(multiline);
        if (parsed.inQuotes) {
            inQuotes = true;
            continue;
        } else {
            inQuotes = false;
        }

        const fields = parsed.fields;
        if (!header) {
            header = fields;
            continue;
        }

        const author = fields[0] ? fields[0].trim() : '';
        if (!author && fields.every(f => !f || f.trim() === '')) {
            // completely empty row
            continue;
        }

        totalRows++;
        if (author.includes('배현명')) {
            bhmRows.push({ lineNum, fields });
        } else if (author) {
            if (otherRows.length < 500) {
                otherRows.push({ lineNum, author, fields });
            }
        }
    }

    console.log(`Total non-empty data rows: ${totalRows}`);
    console.log(`BHM rows: ${bhmRows.length}`);

    // Print headers with index
    console.log('\n--- HEADERS ---');
    header.forEach((h, idx) => {
        console.log(`[${idx}] ${h}`);
    });

    // Analyze BHM column fill rates
    console.log('\n--- BHM COLUMN FILL RATES ---');
    const bhmFillCounts = new Array(header.length).fill(0);
    const bhmValueSamples = Array.from({ length: header.length }, () => new Set());
    const bhmBikoCounts = {};

    for (const row of bhmRows) {
        row.fields.forEach((val, idx) => {
            const trimmed = val ? val.trim() : '';
            if (trimmed !== '') {
                bhmFillCounts[idx]++;
                if (bhmValueSamples[idx].size < 5) {
                    bhmValueSamples[idx].add(trimmed);
                }
            }
        });
        const biko = row.fields[1] ? row.fields[1].trim() : '(비고없음)';
        bhmBikoCounts[biko] = (bhmBikoCounts[biko] || 0) + 1;
    }

    header.forEach((h, idx) => {
        const count = bhmFillCounts[idx];
        const pct = ((count / bhmRows.length) * 100).toFixed(1);
        const samples = Array.from(bhmValueSamples[idx]).slice(0, 3).join(' | ');
        console.log(`[${idx}] ${h}: ${count} / ${bhmRows.length} (${pct}%) -- samples: ${samples}`);
    });

    console.log('\n--- BHM BIKO (비고) DISTRIBUTION ---');
    console.log(JSON.stringify(bhmBikoCounts, null, 2));

    // Sample 5 BHM rows in full detail
    console.log('\n--- SAMPLE 5 BHM ROWS DETAIL ---');
    for (let i = 0; i < Math.min(5, bhmRows.length); i++) {
        console.log(`\nRow #${i + 1} (Line ${bhmRows[i].lineNum}):`);
        header.forEach((h, idx) => {
            const v = bhmRows[i].fields[idx] || '';
            if (v.trim() !== '') {
                console.log(`  [${idx}] ${h}: ${v}`);
            }
        });
    }
}

deepAnalyze().catch(console.error);
