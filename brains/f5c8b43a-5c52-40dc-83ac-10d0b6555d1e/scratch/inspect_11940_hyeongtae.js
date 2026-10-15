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

async function inspect11940AndHyeongtae() {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let lineNum = 0;
    let multiline = '';
    let inQuotes = false;

    let row11940 = null;
    const hyeongtaeRows = [];

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

        if (lineNum === 11940) {
            row11940 = fields;
        }

        const author = fields[0] ? fields[0].trim() : '';
        if (author.includes('배현명') && fields[11] && fields[11].trim() !== '') {
            if (hyeongtaeRows.length < 10) {
                hyeongtaeRows.push({
                    lineNum,
                    company: fields[2],
                    hyeongtae: fields[11],
                    emp: fields[14],
                    date: fields[12],
                    nice: fields[17]
                });
            }
        }
    }

    console.log('=== Line 11940 (윤성) Details ===');
    header.forEach((h, idx) => {
        if (row11940 && row11940[idx] && row11940[idx].trim()) {
            console.log(`  [${idx}] ${h}: "${row11940[idx]}"`);
        }
    });

    console.log('\n=== Sample 형태 (Col 11) rows ===');
    console.log(JSON.stringify(hyeongtaeRows, null, 2));
}

inspect11940AndHyeongtae().catch(console.error);
