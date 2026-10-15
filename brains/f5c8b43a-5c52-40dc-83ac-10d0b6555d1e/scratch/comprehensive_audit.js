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

async function comprehensiveAudit() {
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

    // 1. Column Shift / Massive Corruption
    const shiftIssues = [];
    bhmRows.forEach(r => {
        // check if multiple financial/code columns contain address or other non-financial text
        const addrInCols = [];
        for (let i = 18; i <= 46; i++) {
            if (r.fields[i] && r.fields[i].includes('부산광역시')) {
                addrInCols.push(header[i]);
            }
        }
        if (addrInCols.length > 3) {
            shiftIssues.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                affectedColsCount: addrInCols.length,
                details: `주소 텍스트가 [18]~[46] 등 ${addrInCols.length}개 열에 대량 복사/밀림`
            });
        }
    });

    // 2. Misplaced fields (단일 열 오입력 / 위치 뒤바뀜)
    const misplacedIssues = [];
    bhmRows.forEach(r => {
        // Date column has hangul (e.g. line 5208)
        if (r.fields[12] && /[가-힣]/.test(r.fields[12])) {
            misplacedIssues.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                col: '설립일자',
                val: r.fields[12],
                problem: '설립일자에 업종 텍스트 오입력 (형태/업종/일자 열 혼동)'
            });
        }
        // Zip code has CEO name (e.g. line 11940)
        if (r.fields[5] && !/^\d+$/.test(r.fields[5])) {
            misplacedIssues.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                col: '우편번호',
                val: r.fields[5],
                problem: '우편번호 열에 대표자명 오입력'
            });
        }
        // Email has URL (line 11959)
        if (r.fields[10] && r.fields[10].startsWith('http')) {
            misplacedIssues.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                col: '이메일',
                val: r.fields[10],
                problem: '이메일 열에 홈페이지 URL 오입력'
            });
        }
        // Company name has '(폐업)'
        if (r.fields[2] && r.fields[2].includes('(폐업)')) {
            misplacedIssues.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                col: '회사명',
                val: r.fields[2],
                problem: '회사명에 (폐업) 문구 포함, 비고 컬럼에는 미기재'
            });
        }
        // Employee count has text
        if (r.fields[14] && !/^\d+$/.test(r.fields[14].trim())) {
            misplacedIssues.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                col: '종업원수',
                val: r.fields[14],
                problem: '종업원수에 순수 숫자 대신 텍스트("20 미만") 입력'
            });
        }
    });

    // 3. Typos in 비고
    const typoNotes = [];
    bhmRows.forEach(r => {
        const b = r.fields[1] ? r.fields[1].trim() : '';
        if (b.includes('패업')) {
            typoNotes.push({ lineNum: r.lineNum, company: r.fields[2], biko: b, fix: '폐업' });
        }
        if (b.includes('옮은사업자번호')) {
            typoNotes.push({ lineNum: r.lineNum, company: r.fields[2], biko: b, fix: b.replace('옮은', '옳은') });
        }
    });

    // 4. Inconsistent Business Number update (비고에 맞는 번호만 적고 Col 3 미반영)
    const bizNoteNotUpdated = [];
    bhmRows.forEach(r => {
        const b = r.fields[1] ? r.fields[1].trim() : '';
        const match = b.match(/(옮은|옳은|맞는)사업자번호\s*:\s*([\d-]+)/);
        if (match) {
            const notedBiz = match[2].replace(/-/g, '');
            const col3Biz = r.fields[3].replace(/-/g, '');
            if (notedBiz !== col3Biz) {
                bizNoteNotUpdated.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    biko: b,
                    col3_cur: r.fields[3],
                    notedBiz: match[2],
                    cleanNotedBiz: notedBiz
                });
            }
        }
    });

    // 5. Excel Auto-formatting data corruption (전화번호/우편번호 앞자리 0 누락)
    const phoneZeroDropped = [];
    const zipZeroDropped = [];
    bhmRows.forEach(r => {
        [7, 8, 55].forEach(cIdx => {
            const p = r.fields[cIdx] ? r.fields[cIdx].trim() : '';
            if (/^(10\d{7,8}|[2-6]\d{7,9}|70\d{7,8})$/.test(p)) {
                phoneZeroDropped.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    col: header[cIdx],
                    val: p,
                    fixed: '0' + p
                });
            }
        });
        const z = r.fields[5] ? r.fields[5].trim() : '';
        if (/^\d{4}$/.test(z)) {
            zipZeroDropped.push({
                lineNum: r.lineNum,
                company: r.fields[2],
                val: z,
                fixed: '0' + z
            });
        }
    });

    // 6. Dot / Hyphen Placeholder items in contact fields
    const placeholderItems = [];
    bhmRows.forEach(r => {
        [7, 8, 10, 55, 56].forEach(cIdx => {
            const v = r.fields[cIdx] ? r.fields[cIdx].trim() : '';
            if (v === '.' || v === '-' || v === '..' || v === '/') {
                placeholderItems.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    col: header[cIdx],
                    val: v
                });
            }
        });
    });

    // 7. Newline character in phone/contact numbers
    const newlineInPhone = [];
    bhmRows.forEach(r => {
        [7, 8, 55].forEach(cIdx => {
            const p = r.fields[cIdx] || '';
            if (p.includes('\n') || p.includes('\r')) {
                newlineInPhone.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    col: header[cIdx],
                    val: JSON.stringify(p),
                    fixed: p.replace(/[\r\n]/g, '').trim()
                });
            }
        });
    });

    // 8. Closed companies with respondent info
    const closedWithResp = [];
    bhmRows.forEach(r => {
        const b = r.fields[1] ? r.fields[1].trim() : '';
        const c = r.fields[2] ? r.fields[2].trim() : '';
        if (b.includes('폐업') || b.includes('휴업') || b.includes('패업') || c.includes('폐업')) {
            const respName = r.fields[52] ? r.fields[52].trim() : '';
            const respPhone = r.fields[55] ? r.fields[55].trim() : '';
            if (respName || respPhone) {
                closedWithResp.push({
                    lineNum: r.lineNum,
                    company: r.fields[2],
                    biko: b,
                    respName,
                    respPhone
                });
            }
        }
    });

    // Print Full Summary
    console.log('=== AUDIT SUMMARY ===');
    console.log(`1. 열 밀림/대량 복사 오류: ${shiftIssues.length}건`);
    console.log(`2. 단일 열 위치 착오/오입력: ${misplacedIssues.length}건`);
    console.log(`3. 비고 오타: ${typoNotes.length}건`);
    console.log(`4. 사업자번호 정정 비고 기재 후 사업자번호 열 미반영: ${bizNoteNotUpdated.length}건`);
    console.log(`5. 엑셀 앞자리 0 누락: 전화번호 ${phoneZeroDropped.length}건, 우편번호 ${zipZeroDropped.length}건`);
    console.log(`6. 단순 기호(., - 등) 무의미한 플레이스홀더: ${placeholderItems.length}건`);
    console.log(`7. 전화번호 내 불필요 개행문자(\\n): ${newlineInPhone.length}건`);
    console.log(`8. 폐업/휴업 업체에 실사 응답자 정보 기재(검토 필요): ${closedWithResp.length}건`);

    console.log('\n--- DETAILS ---');
    console.log('1. Shift issues:', JSON.stringify(shiftIssues, null, 2));
    console.log('2. Misplaced issues:', JSON.stringify(misplacedIssues, null, 2));
    console.log('3. Typo notes:', JSON.stringify(typoNotes, null, 2));
    console.log('4. Biz notes not updated:', JSON.stringify(bizNoteNotUpdated, null, 2));
    console.log('6. Placeholder items count:', placeholderItems.length, 'Samples:', placeholderItems.slice(0, 10));
    console.log('7. Newline in phone:', JSON.stringify(newlineInPhone, null, 2));
    console.log('8. Closed with resp:', JSON.stringify(closedWithResp, null, 2));
}

comprehensiveAudit().catch(console.error);
