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

async function showOtherDates() {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let lineNum = 0;
    let multiline = '';
    let inQuotes = false;

    const otherDates = [];

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
            const d = fields[12] ? fields[12].trim() : '';
            if (d) {
                let type = 'OTHER';
                if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(d)) {
                    type = 'VALID';
                } else if (/^\d{4}-\d{1,2}$/.test(d)) {
                    type = 'VALID';
                } else if (/^\d{4}-$/.test(d)) {
                    type = 'VALID';
                } else if (/^\d{4}$/.test(d)) {
                    type = 'VALID';
                } else if (/^\d{8}$/.test(d)) {
                    type = 'VALID';
                } else if (/^\d{4}\.\s*\d{1,2}\.\s*\d{1,2}\.?$/.test(d)) {
                    type = 'VALID';
                }
                if (type === 'OTHER') {
                    otherDates.push({ lineNum, company: fields[2], date: d });
                }
            }
        }
    }

    console.log('OTHER dates count:', otherDates.length);
    console.log(JSON.stringify(otherDates, null, 2));
}

showOtherDates().catch(console.error);
