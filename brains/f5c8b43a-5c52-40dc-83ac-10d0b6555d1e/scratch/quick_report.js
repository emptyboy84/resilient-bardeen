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

async function quickReport() {
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

    // 1. Date counts
    const dateCounts = {};
    bhmRows.forEach(r => {
        const d = r.fields[12] ? r.fields[12].trim() : '';
        if (!d) return;
        if (/^\d{4}-$/.test(d)) {
            dateCounts['YYYY- (끝에 하이픈만 있음)'] = (dateCounts['YYYY- (끝에 하이픈만 있음)'] || 0) + 1;
        } else if (/^\d{4}-\d{1,2}$/.test(d)) {
            dateCounts['YYYY-M 또는 YYYY-MM'] = (dateCounts['YYYY-M 또는 YYYY-MM'] || 0) + 1;
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
            dateCounts['YYYY-MM-DD'] = (dateCounts['YYYY-MM-DD'] || 0) + 1;
        } else if (/^\d{4}$/.test(d)) {
            dateCounts['YYYY (연도만)'] = (dateCounts['YYYY (연도만)'] || 0) + 1;
        } else {
            dateCounts['비표준 포맷'] = (dateCounts['비표준 포맷'] || 0) + 1;
        }
    });
    console.log('설립일자 포맷 통계:', dateCounts);

    // 2. Company name anomalies
    const compAnomalies = [];
    bhmRows.forEach(r => {
        const c = r.fields[2] ? r.fields[2].trim() : '';
        if (c.includes('폐업') || c.includes('휴업')) {
            compAnomalies.push({ lineNum: r.lineNum, company: c, biko: r.fields[1] });
        }
    });
    console.log('\n회사명에 (폐업/휴업) 포함:', compAnomalies);

    // 3. Biz diffs
    const bizDiffs = [];
    bhmRows.forEach(r => {
        const b3 = r.fields[3] ? r.fields[3].trim() : '';
        const b23 = r.fields[23] ? r.fields[23].trim() : '';
        if (b3 !== b23) {
            bizDiffs.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                col3_biz: b3,
                col23_biz: b23,
                biko: r.fields[1]
            });
        }
    });
    console.log(`\n사업자번호 불일치 (총 ${bizDiffs.length}건):`, bizDiffs);

    // 4. Missing zero in phones
    const missingZeroPhones = [];
    bhmRows.forEach(r => {
        [7, 8, 55].forEach(colIdx => {
            const p = r.fields[colIdx] ? r.fields[colIdx].trim() : '';
            if (/^(10\d{7,8}|[2-6]\d{7,9}|70\d{7,8})$/.test(p)) {
                missingZeroPhones.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    col: header[colIdx],
                    val: p,
                    fixed: '0' + p
                });
            }
        });
    });
    console.log(`\n앞자리 0 누락 전화번호 (총 ${missingZeroPhones.length}건):`, missingZeroPhones);

    // 5. Note typos
    const noteTypos = [];
    bhmRows.forEach(r => {
        const b = r.fields[1] ? r.fields[1].trim() : '';
        if (b.includes('옮은') || b.includes('패업') || b.includes('맞는')) {
            noteTypos.push({ lineNum: r.lineNum, company: r.fields[2], biko: b });
        }
    });
    console.log(`\n비고 오타 (총 ${noteTypos.length}건):`, noteTypos);
}

quickReport().catch(console.error);
