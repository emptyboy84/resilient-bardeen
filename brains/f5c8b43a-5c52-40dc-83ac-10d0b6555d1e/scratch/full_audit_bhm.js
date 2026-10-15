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

async function fullAudit() {
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
    let allRowLineNumbers = [];

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
            bhmRows.push({
                lineNum,
                idxInBhm: bhmRows.length + 1,
                fields
            });
            allRowLineNumbers.push(lineNum);
        }
    }

    console.log(`BHM Total Rows: ${bhmRows.length}`);
    console.log(`BHM Line Range: min ${Math.min(...allRowLineNumbers)} to max ${Math.max(...allRowLineNumbers)}`);

    // Check row continuity / sections
    let breaks = [];
    for (let i = 1; i < allRowLineNumbers.length; i++) {
        if (allRowLineNumbers[i] !== allRowLineNumbers[i - 1] + 1) {
            breaks.push({
                prevLine: allRowLineNumbers[i - 1],
                nextLine: allRowLineNumbers[i],
                gap: allRowLineNumbers[i] - allRowLineNumbers[i - 1]
            });
        }
    }
    console.log('Line continuity breaks:', JSON.stringify(breaks, null, 2));

    // AUDIT 1: Cell repetition / column shift across fields
    console.log('\n=== AUDIT 1: Cell repetition / Column Shift ===');
    const shiftedRows = [];
    bhmRows.forEach(r => {
        // check if multiple different columns have the exact same non-empty long string (e.g. address or company name)
        const counts = {};
        r.fields.forEach((val, cIdx) => {
            const v = val.trim();
            if (v.length > 5 && cIdx > 1) { // exclude short codes
                counts[v] = (counts[v] || 0) + 1;
            }
        });
        for (const [val, cnt] of Object.entries(counts)) {
            if (cnt >= 5) {
                shiftedRows.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    repeatedValue: val,
                    repeatCount: cnt
                });
                break;
            }
        }
    });
    console.log(`Found ${shiftedRows.length} shifted/repeated rows:`, JSON.stringify(shiftedRows, null, 2));

    // AUDIT 2: Typos in '비고'
    console.log('\n=== AUDIT 2: 비고 (Notes) Analysis & Typos ===');
    const bikoCategories = {};
    const typoNotes = [];
    bhmRows.forEach(r => {
        const b = r.fields[1] ? r.fields[1].trim() : '';
        bikoCategories[b] = (bikoCategories[b] || 0) + 1;
        if (b.includes('패업') || b.includes('옮은') || b.includes('맞는') || b.includes('폐업') || b.includes('휴업')) {
            if (b.includes('패업') || b.includes('옮은')) {
                typoNotes.push({ lineNum: r.lineNum, company: r.fields[2], note: b });
            }
        } else if (b !== '') {
            typoNotes.push({ lineNum: r.lineNum, company: r.fields[2], note: b });
        }
    });
    console.log('All 비고 categories:', JSON.stringify(bikoCategories, null, 2));
    console.log('Typos or unusual notes:', JSON.stringify(typoNotes, null, 2));

    // AUDIT 3: Business Number (사업자번호) inspection
    // Col [3] vs Col [23]
    console.log('\n=== AUDIT 3: Business Number Integrity ===');
    const bizNumIssues = [];
    let bizNumDiffCount = 0;
    bhmRows.forEach(r => {
        const biz3 = r.fields[3] ? r.fields[3].trim() : '';
        const biz23 = r.fields[23] ? r.fields[23].trim() : '';
        const biko = r.fields[1] ? r.fields[1].trim() : '';

        // Check format (should be 10 digits without hyphens, or with hyphens)
        const cleanBiz3 = biz3.replace(/-/g, '');
        if (cleanBiz3.length !== 10 || !/^\d{10}$/.test(cleanBiz3)) {
            bizNumIssues.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                col: 3,
                val: biz3,
                reason: 'Invalid format/length in Col 3'
            });
        }
        if (biz3 !== biz23) {
            bizNumDiffCount++;
            if (bizNumDiffCount <= 10) {
                bizNumIssues.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    biz3,
                    biz23,
                    biko,
                    reason: 'Col 3 != Col 23'
                });
            }
        }
    });
    console.log(`Total rows where Col 3 != Col 23: ${bizNumDiffCount}`);
    console.log('Sample Biz Num issues:', JSON.stringify(bizNumIssues.slice(0, 15), null, 2));

    // AUDIT 4: Date formats (설립일자 Col 12, 창립일자 Col 13)
    console.log('\n=== AUDIT 4: Date Format Patterns & Anomalies ===');
    const datePatterns = {};
    const dateAnomalies = [];
    bhmRows.forEach(r => {
        const d = r.fields[12] ? r.fields[12].trim() : '';
        if (!d) return;

        // classify pattern
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
            datePatterns['YYYY-MM-DD'] = (datePatterns['YYYY-MM-DD'] || 0) + 1;
        } else if (/^\d{4}-\d{1,2}$/.test(d)) {
            datePatterns['YYYY-M(M)'] = (datePatterns['YYYY-M(M)'] || 0) + 1;
        } else if (/^\d{4}-$/.test(d)) {
            datePatterns['YYYY- (trailing hyphen)'] = (datePatterns['YYYY- (trailing hyphen)'] || 0) + 1;
        } else if (/^\d{4}$/.test(d)) {
            datePatterns['YYYY'] = (datePatterns['YYYY'] || 0) + 1;
        } else {
            datePatterns['OTHER'] = (datePatterns['OTHER'] || 0) + 1;
            dateAnomalies.push({ lineNum: r.lineNum, company: r.fields[2], date: d });
        }
    });
    console.log('Date patterns in 설립일자 (Col 12):', JSON.stringify(datePatterns, null, 2));
    console.log('Date anomalies:', JSON.stringify(dateAnomalies, null, 2));

    // AUDIT 5: Phone & Fax & Email formats
    console.log('\n=== AUDIT 5: Contact Info Formats (전화, 팩스, 이메일) ===');
    const emailAnomalies = [];
    const phoneAnomalies = [];
    bhmRows.forEach(r => {
        const email = r.fields[10] ? r.fields[10].trim() : '';
        if (email && (!email.includes('@') || !email.includes('.'))) {
            emailAnomalies.push({ lineNum: r.lineNum, company: r.fields[2], email });
        }
        const respEmail = r.fields[56] ? r.fields[56].trim() : '';
        if (respEmail && (!respEmail.includes('@') || !respEmail.includes('.'))) {
            emailAnomalies.push({ lineNum: r.lineNum, company: r.fields[2], respEmail, note: 'Respondent email' });
        }

        const phone = r.fields[7] ? r.fields[7].trim() : '';
        if (phone && !/^[\d\s\-()]+$/.test(phone)) {
            phoneAnomalies.push({ lineNum: r.lineNum, company: r.fields[2], phone });
        }
        const respPhone = r.fields[55] ? r.fields[55].trim() : '';
        if (respPhone && !/^[\d\s\-()]+$/.test(respPhone)) {
            phoneAnomalies.push({ lineNum: r.lineNum, company: r.fields[2], respPhone, note: 'Respondent phone' });
        }
    });
    console.log(`Email anomalies count: ${emailAnomalies.length}`, JSON.stringify(emailAnomalies, null, 2));
    console.log(`Phone anomalies count: ${phoneAnomalies.length}`, JSON.stringify(phoneAnomalies, null, 2));

    // AUDIT 6: Closed/Suspended companies (폐업/휴업) vs Data entered
    console.log('\n=== AUDIT 6: Closed/Suspended vs Respondent Info ===');
    const closedWithRespondent = [];
    bhmRows.forEach(r => {
        const biko = r.fields[1] ? r.fields[1].trim() : '';
        if (biko.includes('폐업') || biko.includes('휴업') || biko.includes('패업')) {
            const respName = r.fields[52] ? r.fields[52].trim() : '';
            const respPhone = r.fields[55] ? r.fields[55].trim() : '';
            if (respName || respPhone) {
                closedWithRespondent.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    biko,
                    respName,
                    respPhone
                });
            }
        }
    });
    console.log(`Closed/Suspended with Respondent Info count: ${closedWithRespondent.length}`, JSON.stringify(closedWithRespondent, null, 2));

    // AUDIT 7: Employee count (종업원수 Col 14)
    console.log('\n=== AUDIT 7: Employee Count Format ===');
    const empPatterns = {};
    const empAnomalies = [];
    bhmRows.forEach(r => {
        const emp = r.fields[14] ? r.fields[14].trim() : '';
        if (!emp) return;
        if (/^\d+$/.test(emp)) {
            empPatterns['Pure Number'] = (empPatterns['Pure Number'] || 0) + 1;
        } else if (/^\d+명$/.test(emp)) {
            empPatterns['Number + 명'] = (empPatterns['Number + 명'] || 0) + 1;
        } else {
            empPatterns['OTHER'] = (empPatterns['OTHER'] || 0) + 1;
            empAnomalies.push({ lineNum: r.lineNum, company: r.fields[2], emp });
        }
    });
    console.log('Employee count patterns:', JSON.stringify(empPatterns, null, 2));
    console.log('Employee anomalies:', JSON.stringify(empAnomalies, null, 2));

    // AUDIT 8: Respondent Info Stats
    console.log('\n=== AUDIT 8: Respondent Info Statistics ===');
    let respondentCount = 0;
    bhmRows.forEach(r => {
        const name = r.fields[52] ? r.fields[52].trim() : '';
        const dept = r.fields[53] ? r.fields[53].trim() : '';
        const title = r.fields[54] ? r.fields[54].trim() : '';
        const phone = r.fields[55] ? r.fields[55].trim() : '';
        const email = r.fields[56] ? r.fields[56].trim() : '';
        if (name || dept || title || phone || email) {
            respondentCount++;
        }
    });
    console.log(`Rows with at least one respondent field filled: ${respondentCount} / ${bhmRows.length} (${((respondentCount / bhmRows.length) * 100).toFixed(1)}%)`);
}

fullAudit().catch(console.error);
