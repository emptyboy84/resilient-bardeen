const fs = require('fs');
const readline = require('readline');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/analyze_bae_pattern_data/node_modules/exceljs');

const inputCsvPath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_여기까지했어요.csv";
const outputXlsxPath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_교정완료.xlsx";
const outputCsvPath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_교정완료.csv";

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

function formatKoreanPhone(phoneStr) {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.length === 10 && digits.startsWith('10')) {
        // missing leading 0
        const full = '0' + digits;
        return `${full.substring(0, 3)}-${full.substring(3, 7)}-${full.substring(7)}`;
    }
    if (digits.length === 11 && digits.startsWith('010')) {
        return `${digits.substring(0, 3)}-${digits.substring(3, 7)}-${digits.substring(7)}`;
    }
    if (digits.length === 10 && digits.startsWith('010')) {
        return `${digits.substring(0, 3)}-${digits.substring(3, 6)}-${digits.substring(6)}`;
    }
    return phoneStr;
}

function escapeCsvField(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

async function runCorrection() {
    console.log('Starting data reading and correction...');
    const fileStream = fs.createReadStream(inputCsvPath, { encoding: 'utf-8' });
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let header = null;
    let lineNum = 0;
    let multiline = '';
    let inQuotes = false;

    const allRows = [];
    const changeLogs = [];

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
            allRows.push({ lineNum, fields: [...fields], modifiedCols: new Set() });
            continue;
        }

        // Stop processing after line 20504 (all remaining rows are empty)
        if (lineNum > 20504) {
            break;
        }

        const isBhm = fields[0] && fields[0].trim().includes('배현명');
        const modifiedCols = new Set();
        const rowObj = { lineNum, fields: [...fields], modifiedCols };

        if (isBhm) {
            const company = fields[2] ? fields[2].trim() : '';

            function modifyCell(colIdx, newVal, reason) {
                const oldVal = fields[colIdx] !== undefined ? fields[colIdx] : '';
                if (oldVal !== newVal) {
                    rowObj.fields[colIdx] = newVal;
                    modifiedCols.add(colIdx);
                    changeLogs.push({
                        lineNum,
                        company,
                        colIdx,
                        colName: header[colIdx],
                        oldVal,
                        newVal,
                        reason
                    });
                }
            }

            // 1. Specific known rows
            if (lineNum === 5435) { // 부경기계산업
                modifyCell(7, '051-314-8427', '실사 확인 전화번호 복구');
                modifyCell(11, '', '열 밀림 텍스트 제거');
                modifyCell(12, '', '설립일자에 들어간 업종 텍스트 제거');
                modifyCell(13, '', '창립일자에 복사된 주소 제거');
                modifyCell(14, '1', '종업원수 1 복구');
                for (let c = 18; c <= 22; c++) modifyCell(c, '', '주소 오복사 초기화');
                modifyCell(23, '6063050800', '사업자번호 복구');
                modifyCell(25, '', '앞주 오복사 초기화');
                modifyCell(27, '', '뒷주 오복사 초기화');
                modifyCell(28, '', '영문명 오복사 초기화');
                modifyCell(29, '', '구상호명 오복사 초기화');
                modifyCell(30, '12월', '결산월 복구');
                for (let c = 31; c <= 46; c++) modifyCell(c, '', '재무/지역 열 주소 오복사 초기화');
                for (let c = 50; c <= 57; c++) modifyCell(c, '', '코드/응답자 열 주소 오복사 초기화');
            } else if (lineNum === 5208) { // (주)비엔아이
                modifyCell(11, '', '형태에 들어간 종업원수(4) 이동 후 초기화');
                modifyCell(14, '4', '종업원수 4 정상 반영');
                modifyCell(12, '', '설립일자에 오입력된 업종 텍스트 초기화');
            } else if (lineNum === 11940) { // 윤성
                modifyCell(5, '38459', '우편번호 열에 오입력된 대표자명 -> 도로명 우편번호(38459)로 교정');
            } else if (lineNum === 11959) { // 야나닷컴
                modifyCell(9, 'http://www.yarn-a.com/', '이메일 열에 있던 홈페이지 URL을 홈페이지 열로 이동');
                modifyCell(10, '', '이메일 열의 URL 제거');
            } else if (lineNum === 20496) { // (주)티에이싱크(폐업)
                modifyCell(2, '(주)티에이싱크', '회사명에서 (폐업) 문구 분리');
                modifyCell(1, '폐업', '비고란에 폐업 표기');
                modifyCell(14, '20', '종업원수 텍스트("20 미만") -> 숫자 20으로 표준화');
            }

            // 2. 비고 오타 & 사업자번호 동기화
            if (lineNum === 19269) { // ㈜에코앤
                modifyCell(1, '폐업, 맞는사업자번호: 136-87-01124', '비고 오타("옮은") 교정');
                modifyCell(3, '1368701124', '비고의 정정 사업자번호를 사업자번호 열에 반영');
            } else if (lineNum === 19271) { // (주)운복
                modifyCell(1, '맞는사업자번호: 761-87-01634', '비고 오타("옮은") 교정');
                modifyCell(3, '7618701634', '비고의 정정 사업자번호를 사업자번호 열에 반영');
            } else if (lineNum === 19348) { // (주)씨에스물류에스에이치지점
                modifyCell(3, '7698501503', '비고의 정정 사업자번호를 사업자번호 열에 반영');
            } else if (lineNum === 19350) { // (주)리콘
                modifyCell(3, '7968601439', '비고의 정정 사업자번호를 사업자번호 열에 반영');
            } else if (lineNum === 19409) { // 태건
                modifyCell(1, '폐업', '비고 오타("패업") -> "폐업" 교정');
            }

            // 3. Newline in phone numbers
            [7, 8, 55].forEach(cIdx => {
                const val = rowObj.fields[cIdx] || '';
                if (val.includes('\n') || val.includes('\r')) {
                    const cleanPhone = val.replace(/[\r\n]/g, '').trim();
                    modifyCell(cIdx, cleanPhone, '전화번호 앞 줄바꿈(\\n) 제거');
                }
            });

            // 4. Missing leading zero in phones
            [7, 8, 55].forEach(cIdx => {
                const val = rowObj.fields[cIdx] ? rowObj.fields[cIdx].trim() : '';
                if (/^10\d{7,8}$/.test(val)) {
                    const formatted = formatKoreanPhone(val);
                    modifyCell(cIdx, formatted, '휴대폰 번호 앞자리 0 복원 및 표준 하이픈 서식화');
                } else if (/^010\d{8}$/.test(val)) {
                    const formatted = formatKoreanPhone(val);
                    modifyCell(cIdx, formatted, '휴대폰 번호 표준 하이픈 서식화');
                }
            });

            // 5. 5-digit zip code missing leading 0
            const zipVal = rowObj.fields[5] ? rowObj.fields[5].trim() : '';
            if (/^\d{4}$/.test(zipVal)) {
                modifyCell(5, '0' + zipVal, '4자리 우편번호 앞자리 0 패딩 복원 (5자리)');
            } else if (zipVal === '06178 ') {
                modifyCell(5, '06178', '우편번호 끝 공백 제거');
            }

            // 6. Dot or hyphen placeholder in contact fields
            [7, 8, 10, 55, 56].forEach(cIdx => {
                const v = rowObj.fields[cIdx] ? rowObj.fields[cIdx].trim() : '';
                if (v === '.' || v === '-' || v === '..' || v === '/') {
                    modifyCell(cIdx, '', '단순 기호(플레이스홀더) 공백 처리');
                }
            });

            // 7. 설립일자 끝 하이픈 및 기호 정리
            const dateVal = rowObj.fields[12] ? rowObj.fields[12].trim() : '';
            if (/^\d{4}-$/.test(dateVal)) {
                modifyCell(12, dateVal.replace('-', ''), '설립일자 끝 불필요 하이픈 제거 (연도 표기 통일)');
            } else if (dateVal === '..' || dateVal === '-') {
                modifyCell(12, '', '설립일자 단순 기호(.., -) 공백 처리');
            }
        }

        allRows.push(rowObj);
    }

    console.log(`Read ${allRows.length} rows (including header).`);
    console.log(`Total modifications made: ${changeLogs.length} cells across 배현명 rows.`);

    // Build Excel Workbook
    console.log('Generating Excel Workbook with Blue Highlighting...');
    const wb = new ExcelJS.Workbook();
    wb.creator = '배현명 (Antigravity 검수팀)';
    wb.created = new Date();

    const wsData = wb.addWorksheet('실사DB_전체취합_교정본');

    // Header styling
    const headerRow = wsData.addRow(header);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1F4E78' } // Navy Header
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            bottom: { style: 'medium', color: { argb: 'FF1F4E78' } },
            left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
            right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
        };
    });

    // Blue style definitions for modified cells
    const BLUE_FONT = { color: { argb: 'FF002060' }, bold: true, size: 10 };
    const BLUE_FILL = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' } // Light soft blue
    };
    const BLUE_BORDER = {
        top: { style: 'thin', color: { argb: 'FF8EA9DB' } },
        bottom: { style: 'thin', color: { argb: 'FF8EA9DB' } },
        left: { style: 'thin', color: { argb: 'FF8EA9DB' } },
        right: { style: 'thin', color: { argb: 'FF8EA9DB' } }
    };

    // Add rows and style
    for (let i = 1; i < allRows.length; i++) {
        const rowObj = allRows[i];
        const addedRow = wsData.addRow(rowObj.fields);

        if (rowObj.modifiedCols.size > 0) {
            rowObj.modifiedCols.forEach(colIdx => {
                const cell = addedRow.getCell(colIdx + 1); // 1-based index
                cell.font = BLUE_FONT;
                cell.fill = BLUE_FILL;
                cell.border = BLUE_BORDER;
            });
        }
    }

    // Auto-fit column widths (sample first 100 rows + modified)
    wsData.columns.forEach((col, idx) => {
        let maxLen = header[idx] ? header[idx].length * 2 : 10;
        col.width = Math.max(maxLen + 4, 12);
    });

    // Add Sheet 2: 교정내역 상세
    console.log('Adding Sheet 2: 교정내역_상세...');
    const wsLog = wb.addWorksheet('배현명_교정내역_상세');
    const logHeader = ['연번', '마스터 행번호', '회사명', '교정 컬럼', '교정 전(기존값)', '교정 후(수정값)', '교정 사유 및 조치내용'];
    const logHeaderRow = wsLog.addRow(logHeader);
    logHeaderRow.height = 24;
    logHeaderRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF203764' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    changeLogs.forEach((log, idx) => {
        const r = wsLog.addRow([
            idx + 1,
            log.lineNum,
            log.company,
            log.colName,
            log.oldVal,
            log.newVal,
            log.reason
        ]);
        r.getCell(6).font = BLUE_FONT;
        r.getCell(6).fill = BLUE_FILL;
    });

    wsLog.columns = [
        { width: 8 },
        { width: 14 },
        { width: 28 },
        { width: 20 },
        { width: 35 },
        { width: 35 },
        { width: 45 }
    ];

    console.log('Saving Excel file to:', outputXlsxPath);
    await wb.xlsx.writeFile(outputXlsxPath);
    console.log('Excel file successfully created!');

    // Build Output CSV
    console.log('Saving updated CSV file to:', outputCsvPath);
    const csvLines = [];
    csvLines.push(header.map(escapeCsvField).join(','));
    for (let i = 1; i < allRows.length; i++) {
        csvLines.push(allRows[i].fields.map(escapeCsvField).join(','));
    }
    fs.writeFileSync(outputCsvPath, '\uFEFF' + csvLines.join('\r\n'), 'utf-8');
    console.log('CSV file successfully created!');

    console.log('\n=== EXECUTION SUMMARY ===');
    console.log(`Total rows processed: ${allRows.length - 1}`);
    console.log(`Total cells corrected: ${changeLogs.length}`);
    const summaryByReason = {};
    changeLogs.forEach(l => {
        summaryByReason[l.reason] = (summaryByReason[l.reason] || 0) + 1;
    });
    console.log('Modifications breakdown:', JSON.stringify(summaryByReason, null, 2));
}

runCorrection().catch(console.error);
