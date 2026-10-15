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

async function detailedAudit() {
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

    console.log(`Analyzing ${bhmRows.length} BHM rows...`);

    // 1. Check Date Formats breakdown
    const dateCounts = {};
    const dateHyphenTrailing = [];
    const dateNonStandard = [];
    bhmRows.forEach(r => {
        const d = r.fields[12] ? r.fields[12].trim() : '';
        if (!d) return;
        if (/^\d{4}-$/.test(d)) {
            dateCounts['YYYY- (끝에 하이픈만 있음)'] = (dateCounts['YYYY- (끝에 하이픈만 있음)'] || 0) + 1;
            if (dateHyphenTrailing.length < 5) dateHyphenTrailing.push({ lineNum: r.lineNum, company: r.fields[2], val: d });
        } else if (/^\d{4}-\d{1,2}$/.test(d)) {
            dateCounts['YYYY-M 또는 YYYY-MM'] = (dateCounts['YYYY-M 또는 YYYY-MM'] || 0) + 1;
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
            dateCounts['YYYY-MM-DD'] = (dateCounts['YYYY-MM-DD'] || 0) + 1;
        } else if (/^\d{4}$/.test(d)) {
            dateCounts['YYYY (연도만)'] = (dateCounts['YYYY (연도만)'] || 0) + 1;
        } else {
            dateCounts['비표준 (YYYYMMDD, . 등)'] = (dateCounts['비표준 (YYYYMMDD, . 등)'] || 0) + 1;
            dateNonStandard.push({ lineNum: r.lineNum, company: r.fields[2], val: d });
        }
    });

    console.log('\n=== 설립일자(Col 12) 포맷 통계 ===');
    console.log(JSON.stringify(dateCounts, null, 2));
    console.log('Trailing hyphen samples:', dateHyphenTrailing);
    console.log('Non-standard dates count:', dateNonStandard.length, 'Samples:', dateNonStandard.slice(0, 10));

    // 2. Company name containing (폐업)
    console.log('\n=== 회사명에 (폐업) 등이 포함된 경우 ===');
    const compNameAnomalies = [];
    bhmRows.forEach(r => {
        const c = r.fields[2] ? r.fields[2].trim() : '';
        if (c.includes('폐업') || c.includes('휴업') || c.includes('이전') || c.includes('삭제')) {
            compNameAnomalies.push({ lineNum: r.lineNum, company: c, biko: r.fields[1] });
        }
    });
    console.log('Found:', compNameAnomalies);

    // 3. Biz Number differences (Col 3 vs Col 23)
    console.log('\n=== 사업자번호(Col 3) vs 원본 사업자번호(Col 23) 불일치 ===');
    const bizDiffs = [];
    bhmRows.forEach(r => {
        const b3 = r.fields[3] ? r.fields[3].trim() : '';
        const b23 = r.fields[23] ? r.fields[23].trim() : '';
        if (b3 !== b23) {
            bizDiffs.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                bizCol3: b3,
                bizCol23: b23,
                biko: r.fields[1]
            });
        }
    });
    console.log(`Total biz diff count: ${bizDiffs.length}`);
    console.log(JSON.stringify(bizDiffs, null, 2));

    // 4. Phone numbers missing leading 0
    console.log('\n=== 전화번호 맨 앞자리 0 누락 (엑셀 숫자서식 오류 의심) ===');
    const missingZeroPhones = [];
    bhmRows.forEach(r => {
        [7, 8, 55].forEach(colIdx => {
            const p = r.fields[colIdx] ? r.fields[colIdx].trim() : '';
            // if it starts with 10, 51, 2, 70, 31, etc. and is purely numeric with 8~10 digits
            if (/^(10\d{7,8}|[2-6]\d{7,9}|70\d{7,8})$/.test(p)) {
                missingZeroPhones.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    colName: header[colIdx],
                    val: p,
                    suggested: '0' + p
                });
            }
        });
    });
    console.log(`Found ${missingZeroPhones.length} missing leading zero phones:`);
    console.log(JSON.stringify(missingZeroPhones, null, 2));

    // 5. Notes with typos
    console.log('\n=== 비고 오타 / 비표준 상세 ===');
    const noteTypos = [];
    bhmRows.forEach(r => {
        const b = r.fields[1] ? r.fields[1].trim() : '';
        if (b.includes('옮은') || b.includes('패업') || b.includes('맞는')) {
            noteTypos.push({ lineNum: r.lineNum, company: r.fields[2], biko: b });
        }
    });
    console.log(JSON.stringify(noteTypos, null, 2));

    // 6. Dot or hyphen placeholder in emails / phones
    console.log('\n=== 연락처/이메일에 단순 점(.) 또는 하이픈(-) 표기 ===');
    const placeholderItems = [];
    bhmRows.forEach(r => {
        [7, 8, 10, 55, 56].forEach(colIdx => {
            const v = r.fields[colIdx] ? r.fields[colIdx].trim() : '';
            if (v === '.' || v === '-' || v === '..' || v === '/') {
                placeholderItems.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    colName: header[colIdx],
                    val: v
                });
            }
        });
    });
    console.log(`Found ${placeholderItems.length} placeholders:`);
    console.log(JSON.stringify(placeholderItems, null, 2));

    // 7. Check Line 5435 corruption detail
    console.log('\n=== Line 5435 (부경기계산업) 상세 분석 ===');
    const r5435 = bhmRows.find(r => r.lineNum === 5435);
    if (r5435) {
        console.log('Raw fields around 5435:');
        header.forEach((h, idx) => {
            console.log(`  [${idx}] ${h}: "${r5435.fields[idx]}"`);
        });
    }
}

detailedAudit().catch(console.error);
