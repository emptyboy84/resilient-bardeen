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

async function getStatsPart1() {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let lineNum = 0;
    let multiline = '';
    let inQuotes = false;

    const bhmLines = [];

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
            bhmLines.push(lineNum);
        }
    }

    console.log(`Total BHM lines: ${bhmLines.length}`);
    console.log(`Min line: ${Math.min(...bhmLines)}, Max line: ${Math.max(...bhmLines)}`);

    // Ranges of contiguous lines
    const ranges = [];
    let start = bhmLines[0];
    let prev = bhmLines[0];
    for (let i = 1; i < bhmLines.length; i++) {
        if (bhmLines[i] === prev + 1) {
            prev = bhmLines[i];
        } else {
            ranges.push({ start, end: prev, count: prev - start + 1 });
            start = bhmLines[i];
            prev = bhmLines[i];
        }
    }
    ranges.push({ start, end: prev, count: prev - start + 1 });
    console.log('Contiguous line blocks of BHM:');
    ranges.forEach((r, idx) => {
        console.log(`  Block ${idx + 1}: Lines ${r.start} ~ ${r.end} (${r.count} rows)`);
    });
}

getStatsPart1().catch(console.error);
