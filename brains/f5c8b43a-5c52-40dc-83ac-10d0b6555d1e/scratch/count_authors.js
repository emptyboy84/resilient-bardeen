const fs = require('fs');
const readline = require('readline');

const filePath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_여기까지했어요.csv";

// Robust CSV streaming parser
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

async function analyze() {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let lineNum = 0;
    let multiline = '';
    let inQuotes = false;

    const authorCounts = {};
    let totalRecords = 0;
    let bhmRecords = 0;
    let bhmRowIndices = [];

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
            console.log('Header length:', header.length);
            console.log('Header:', JSON.stringify(header));
            continue;
        }

        totalRecords++;
        const author = fields[0] ? fields[0].trim() : '(빈값)';
        authorCounts[author] = (authorCounts[author] || 0) + 1;

        if (author.includes('배현명')) {
            bhmRecords++;
            if (bhmRowIndices.length < 10) {
                bhmRowIndices.push({
                    recordIndex: totalRecords,
                    rawRow: lineNum,
                    author: fields[0],
                    biko: fields[1],
                    company: fields[2],
                    bizNum: fields[3],
                    ceo: fields[4]
                });
            }
        }
    }

    console.log('\nTotal Records:', totalRecords);
    console.log('Author counts:', JSON.stringify(authorCounts, null, 2));
    console.log('\nSample BHM rows:', JSON.stringify(bhmRowIndices, null, 2));
}

analyze().catch(console.error);
