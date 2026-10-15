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

async function inspectAnomalies() {
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
        if (author.includes('배현명')) {
            bhmRows.push({ lineNum, fields });
        }
    }

    console.log(`Loaded ${bhmRows.length} BHM rows.`);

    // Find the row with "공항앞길" (the shifted row)
    for (let i = 0; i < bhmRows.length; i++) {
        const row = bhmRows[i];
        const isShifted = row.fields.some((f, idx) => idx >= 18 && f && f.includes('공항앞길'));
        if (isShifted) {
            console.log(`\n=== FOUND SHIFTED ROW at index ${i + 1}, Line ${row.lineNum} ===`);
            header.forEach((h, idx) => {
                console.log(`  [${idx}] ${h}: "${row.fields[idx] || ''}"`);
            });
        }
    }

    // Let's check how many total fields each row has
    const fieldLengthDistribution = {};
    bhmRows.forEach(r => {
        fieldLengthDistribution[r.fields.length] = (fieldLengthDistribution[r.fields.length] || 0) + 1;
    });
    console.log('\nField count distribution:', fieldLengthDistribution);

    // Let's inspect rows around the shifted row (e.g. preceding and following)
}

inspectAnomalies().catch(console.error);
