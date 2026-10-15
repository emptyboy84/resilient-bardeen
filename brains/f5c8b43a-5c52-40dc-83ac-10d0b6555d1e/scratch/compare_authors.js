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

async function compareAuthors() {
    const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let lineNum = 0;
    let multiline = '';
    let inQuotes = false;

    const authors = ['배현명', '안재한', '정은미', '차민영', '이수민'];
    const authorStats = {};
    authors.forEach(a => {
        authorStats[a] = {
            count: 0,
            fillCounts: [],
            bikoCounts: {}
        };
    });

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
            authors.forEach(a => {
                authorStats[a].fillCounts = new Array(header.length).fill(0);
            });
            continue;
        }

        const rawAuthor = fields[0] ? fields[0].trim() : '';
        for (const target of authors) {
            if (rawAuthor.startsWith(target)) {
                authorStats[target].count++;
                fields.forEach((val, idx) => {
                    if (val && val.trim() !== '') {
                        authorStats[target].fillCounts[idx]++;
                    }
                });
                const biko = fields[1] ? fields[1].trim() : '(빈값)';
                authorStats[target].bikoCounts[biko] = (authorStats[target].bikoCounts[biko] || 0) + 1;
                break;
            }
        }
    }

    console.log('=== AUTHOR FILL RATE COMPARISON (in %) ===');
    const headerCols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 17, 23, 24, 30, 32, 47, 48, 49, 52, 53, 54, 55, 56];
    
    console.log('Idx | Header | ' + authors.map(a => `${a}(${authorStats[a].count})`).join(' | '));
    headerCols.forEach(idx => {
        const colName = header[idx].substring(0, 12);
        const rowVals = authors.map(a => {
            const pct = ((authorStats[a].fillCounts[idx] / authorStats[a].count) * 100).toFixed(0);
            return `${pct}%`.padStart(8);
        }).join(' | ');
        console.log(`${idx.toString().padStart(3)} | ${colName.padEnd(12)} | ${rowVals}`);
    });

    console.log('\n=== BIKO COMPARISON ===');
    authors.forEach(a => {
        console.log(`\n[${a}] 비고 top 5:`, JSON.stringify(Object.entries(authorStats[a].bikoCounts).sort((x, y) => y[1] - x[1]).slice(0, 5)));
    });
}

compareAuthors().catch(console.error);
