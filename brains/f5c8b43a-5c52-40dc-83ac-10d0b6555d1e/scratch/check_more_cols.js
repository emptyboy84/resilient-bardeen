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

async function checkMoreColumns() {
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

    // 1. 형태 (Col 11) distribution
    const hyeongtaeCounts = {};
    bhmRows.forEach(r => {
        const v = r.fields[11] ? r.fields[11].trim() : '(빈값)';
        hyeongtaeCounts[v] = (hyeongtaeCounts[v] || 0) + 1;
    });
    console.log('형태(Col 11) 분포:', JSON.stringify(hyeongtaeCounts, null, 2));

    // 2. Korean in 설립일자 (Col 12)
    const koreanInDate = [];
    bhmRows.forEach(r => {
        const d = r.fields[12] ? r.fields[12].trim() : '';
        if (/[가-힣]/.test(d)) {
            koreanInDate.push({ lineNum: r.lineNum, company: r.fields[2], val: d });
        }
    });
    console.log('\n설립일자에 한글 포함:', koreanInDate);

    // 3. Korean in 종업원수 (Col 14)
    const koreanInEmp = [];
    bhmRows.forEach(r => {
        const e = r.fields[14] ? r.fields[14].trim() : '';
        if (e && !/^\d+$/.test(e)) {
            koreanInEmp.push({ lineNum: r.lineNum, company: r.fields[2], val: e });
        }
    });
    console.log('\n종업원수에 숫자가 아닌 값:', koreanInEmp);

    // 4. Korean or invalid in 우편번호 (Col 5)
    const invalidZip = [];
    bhmRows.forEach(r => {
        const z = r.fields[5] ? r.fields[5].trim() : '';
        if (z && !/^\d{5}$/.test(z)) {
            invalidZip.push({ lineNum: r.lineNum, company: r.fields[2], val: z });
        }
    });
    console.log(`\n우편번호 5자리 숫자가 아닌 행 (총 ${invalidZip.length}건):`, invalidZip.slice(0, 10));

    // 5. 업종코드1 (Col 15) and 업종코드2 (Col 16)
    let code1Count = 0;
    let code2Count = 0;
    bhmRows.forEach(r => {
        if (r.fields[15] && r.fields[15].trim()) code1Count++;
        if (r.fields[16] && r.fields[16].trim()) code2Count++;
    });
    console.log(`\n업종코드1 입력 건수: ${code1Count}, 업종코드2 입력 건수: ${code2Count}`);
}

checkMoreColumns().catch(console.error);
