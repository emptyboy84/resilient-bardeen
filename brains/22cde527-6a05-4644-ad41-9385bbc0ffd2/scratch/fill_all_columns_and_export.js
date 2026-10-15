const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const origCsvPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const targetXlsxPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = origCsvPath;

const verifiedResultsFile = path.join(SCRATCH_DIR, 'verified_results.json');
const articleCacheFile = path.join(SCRATCH_DIR, 'bizno_articles_cache.json');

// Checksum validation
function isValidBizNo(b) {
    if (!b) return false;
    const clean = b.replace(/[^0-9]/g, '');
    if (clean.length !== 10) return false;
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
        sum += Number(clean[i]) * weights[i];
    }
    const d9 = Number(clean[8]) * 5;
    sum += Math.floor(d9 / 10) + (d9 % 10);
    const check = (10 - (sum % 10)) % 10;
    return check === Number(clean[9]);
}

function formatBizNo(b) {
    const clean = b.replace(/[^0-9]/g, '');
    return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
}

function extractBusanDistrict(address) {
    if (!address) return '';
    const m = address.match(/(해운대구|부산진구|동래구|남구|북구|사상구|사하구|금정구|연제구|수영구|중구|동구|서구|영도구|강서구|기장군)/);
    return m ? m[1] : '';
}

function cleanAddress(addr) {
    if (!addr) return '';
    let a = addr.trim();
    // Remove (우편번호...) if present
    a = a.replace(/\(우\s*:\s*[0-9\-]+\)/g, '').trim();
    // Remove "부산광역시 " prefix if it exists to match existing rows
    if (a.startsWith('부산광역시 ')) {
        a = a.replace(/^부산광역시\s+/, '');
    } else if (a.startsWith('부산시 ')) {
        a = a.replace(/^부산시\s+/, '');
    }
    return a;
}

function parseCSV(content) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRow.push(currentCell.trim());
            if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }
    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) rows.push(currentRow);
    }
    return rows;
}

function toCSVLine(cells) {
    return cells.map(cell => {
        const val = (cell === null || cell === undefined) ? '' : String(cell);
        if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
            return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
    }).join(',');
}

// Cache of fetched Bizno articles
let articleCache = {};
if (fs.existsSync(articleCacheFile)) {
    try {
        articleCache = JSON.parse(fs.readFileSync(articleCacheFile, 'utf8'));
    } catch (e) {}
}

async function getBiznoDetails(bizno) {
    const clean = (bizno || '').replace(/[^0-9]/g, '');
    if (clean.length !== 10) return null;

    if (articleCache[clean]) return articleCache[clean];

    const url = `https://bizno.net/article/${clean}`;
    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        if (!res.ok) {
            articleCache[clean] = null;
            return null;
        }
        const html = await res.text();
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        let title = titleMatch ? titleMatch[1].trim() : '';
        if (title.includes('|')) title = title.split('|')[0].trim();
        if (title.includes('-')) title = title.split('-')[0].trim();

        let ceo = '';
        const ceoM = text.match(/대표자명\s*:\s*([^\s]+)/);
        if (ceoM) ceo = ceoM[1].trim();

        let tel = '';
        const telM = text.match(/전화번호\s*:\s*([0-9\-]+)/);
        if (telM && telM[1] !== '--' && telM[1].length > 6) tel = telM[1].trim();

        let fax = '';
        const faxM = text.match(/팩스번호\s*:\s*([0-9\-]+)/);
        if (faxM && faxM[1] !== '--' && faxM[1].length > 6) fax = faxM[1].trim();

        let addr = '';
        const addrM = text.match(/회사주소\s*:\s*([^"]+?)(?=\s*\(우|\s*대표자|\s*사업자등록번호|\s*종업원수|\s*설립일|\s*$)/);
        if (addrM) addr = addrM[1].trim();

        let status = '';
        const statM = text.match(/사업자\s*현재\s*상태[^\:]*:\s*([^\s]+)/);
        if (statM) status = statM[1].trim();

        let closeDate = '';
        const closeM = text.match(/폐업일자\s*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/);
        if (closeM) closeDate = closeM[1].trim();

        let empCount = '';
        const empM = text.match(/종업원수\s*:\s*([0-9]+)명/);
        if (empM) empCount = empM[1].trim();

        let year = '';
        let month = '';
        const estabM = text.match(/설립일[^\:]*:\s*([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})/);
        if (estabM) {
            year = estabM[1];
            month = String(parseInt(estabM[2], 10)); // No leading zero
        }

        const data = {
            bizno: formatBizNo(clean),
            title,
            ceo,
            tel,
            fax,
            address: addr,
            district: extractBusanDistrict(addr),
            cleanAddr: cleanAddress(addr),
            status,
            closeDate,
            empCount,
            year,
            month,
            sourceUrl: url
        };

        articleCache[clean] = data;
        return data;
    } catch (e) {
        return null;
    }
}

async function processAll() {
    console.log('=== Step 1: Loading verified results ===');
    const verifiedData = fs.existsSync(verifiedResultsFile) ? JSON.parse(fs.readFileSync(verifiedResultsFile, 'utf8')) : {};

    console.log('=== Step 2: Reading original CSV ===');
    const buffer = fs.readFileSync(origCsvPath);
    const text = new TextDecoder('utf-8').decode(buffer);
    const rows = parseCSV(text);

    const origHeader = [...rows[0]];
    // Ensure last column is named "데이터 출처"
    let sourceColIdx = origHeader.length - 1;
    if (origHeader[sourceColIdx] === '' || origHeader[sourceColIdx] === undefined) {
        origHeader[sourceColIdx] = '데이터 출처';
    } else {
        origHeader.push('데이터 출처');
        sourceColIdx = origHeader.length - 1;
    }

    const gubunIdx = origHeader.indexOf('구분');
    const seqIdx = origHeader.indexOf('순번');
    const nameIdx = origHeader.indexOf('사업체명');
    const bizIdx = origHeader.indexOf('사업자번호');
    const yearIdx = origHeader.indexOf('설립연도(연도)');
    const monthIdx = origHeader.indexOf('설립연도(월)');
    const ceoIdx = origHeader.indexOf('대표자 성함');
    const telIdx = origHeader.indexOf('연락처');
    const faxIdx = origHeader.indexOf('팩스번호');
    const distIdx = origHeader.indexOf('시군구');
    const addrIdx = origHeader.indexOf('주소');
    const catIdx = origHeader.indexOf('업종분류');
    const contactIdx = origHeader.indexOf('컨택결과');
    const closeDateIdx = origHeader.indexOf('폐업 날짜');
    const remarkIdx = origHeader.indexOf('비고');
    const empIdx = origHeader.indexOf('종사자수(명) 25년 기준');

    console.log('Header mapping complete. Processing rows...');

    // Collect all business numbers that need lookup
    const lookups = [];
    for (let i = 1; i < rows.length; i++) {
        const rowNum = i + 1;
        const key = String(rowNum);
        let bizNo = (rows[i][bizIdx] || '').trim();

        // If blank, check if verified
        if (!bizNo && verifiedData[key] && verifiedData[key].bizno) {
            bizNo = verifiedData[key].bizno;
        }

        if (bizNo && isValidBizNo(bizNo)) {
            lookups.push({ rowIdx: i, rowNum, bizNo: bizNo.replace(/[^0-9]/g, '') });
        }
    }

    console.log(`Total rows with valid business numbers: ${lookups.length}`);

    // Fetch details in batches
    console.log('Fetching details from Bizno/public registries...');
    const BATCH_SIZE = 10;
    for (let b = 0; b < lookups.length; b += BATCH_SIZE) {
        const batch = lookups.slice(b, b + BATCH_SIZE);
        await Promise.all(batch.map(item => getBiznoDetails(item.bizNo)));
        if (b % 100 === 0 || b + BATCH_SIZE >= lookups.length) {
            console.log(`Fetched ${Math.min(b + BATCH_SIZE, lookups.length)} / ${lookups.length} details...`);
            fs.writeFileSync(articleCacheFile, JSON.stringify(articleCache, null, 2), 'utf8');
        }
    }

    console.log('=== Step 3: Populating blanks and styling Excel ===');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('2026_부산_CT산업_실태조사');

    // Header styling
    worksheet.addRow(origHeader);
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
        cell.font = { name: '맑은 고딕', size: 10, bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F2F2' }
        };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    const finalCsvRows = [origHeader];
    let totalFilledCells = 0;
    const filledStats = {
        bizno: 0,
        year: 0,
        month: 0,
        ceo: 0,
        tel: 0,
        fax: 0,
        district: 0,
        address: 0,
        closeDate: 0,
        remark: 0,
        empCount: 0,
        source: 0
    };

    for (let i = 1; i < rows.length; i++) {
        const rowNum = i + 1;
        const key = String(rowNum);
        const rowData = [...rows[i]];
        while (rowData.length < origHeader.length) rowData.push('');

        const newlyFilledCols = new Set();

        // 1. Business Number
        let currentBizNo = (rowData[bizIdx] || '').trim();
        if (!currentBizNo && verifiedData[key] && verifiedData[key].bizno) {
            rowData[bizIdx] = verifiedData[key].bizno;
            currentBizNo = verifiedData[key].bizno;
            newlyFilledCols.add(bizIdx);
            filledStats.bizno++;
        }

        // 2. If business number exists, fill remaining blanks from detail data
        if (currentBizNo && isValidBizNo(currentBizNo)) {
            const cleanDigits = currentBizNo.replace(/[^0-9]/g, '');
            const detail = articleCache[cleanDigits];

            if (detail) {
                // Year
                if ((!rowData[yearIdx] || rowData[yearIdx].trim() === '') && detail.year) {
                    rowData[yearIdx] = detail.year;
                    newlyFilledCols.add(yearIdx);
                    filledStats.year++;
                }
                // Month
                if ((!rowData[monthIdx] || rowData[monthIdx].trim() === '') && detail.month) {
                    rowData[monthIdx] = detail.month;
                    newlyFilledCols.add(monthIdx);
                    filledStats.month++;
                }
                // CEO
                if ((!rowData[ceoIdx] || rowData[ceoIdx].trim() === '') && detail.ceo && !detail.ceo.includes('*')) {
                    rowData[ceoIdx] = detail.ceo;
                    newlyFilledCols.add(ceoIdx);
                    filledStats.ceo++;
                }
                // Tel
                if ((!rowData[telIdx] || rowData[telIdx].trim() === '') && detail.tel) {
                    rowData[telIdx] = detail.tel;
                    newlyFilledCols.add(telIdx);
                    filledStats.tel++;
                }
                // Fax
                if ((!rowData[faxIdx] || rowData[faxIdx].trim() === '') && detail.fax) {
                    rowData[faxIdx] = detail.fax;
                    newlyFilledCols.add(faxIdx);
                    filledStats.fax++;
                }
                // District (시군구)
                if ((!rowData[distIdx] || rowData[distIdx].trim() === '') && detail.district) {
                    rowData[distIdx] = detail.district;
                    newlyFilledCols.add(distIdx);
                    filledStats.district++;
                }
                // Address (주소)
                if ((!rowData[addrIdx] || rowData[addrIdx].trim() === '') && detail.cleanAddr) {
                    rowData[addrIdx] = detail.cleanAddr;
                    newlyFilledCols.add(addrIdx);
                    filledStats.address++;
                }
                // Status / Closure
                if (detail.status && detail.status.includes('폐업')) {
                    if ((!rowData[closeDateIdx] || rowData[closeDateIdx].trim() === '') && detail.closeDate) {
                        rowData[closeDateIdx] = detail.closeDate;
                        newlyFilledCols.add(closeDateIdx);
                        filledStats.closeDate++;
                    }
                    if (!rowData[remarkIdx] || rowData[remarkIdx].trim() === '') {
                        rowData[remarkIdx] = '폐업자';
                        newlyFilledCols.add(remarkIdx);
                        filledStats.remark++;
                    }
                } else if (detail.status && detail.status.includes('휴업')) {
                    if (!rowData[remarkIdx] || rowData[remarkIdx].trim() === '') {
                        rowData[remarkIdx] = '휴업자';
                        newlyFilledCols.add(remarkIdx);
                        filledStats.remark++;
                    }
                }
                // Employee count
                if ((!rowData[empIdx] || rowData[empIdx].trim() === '') && detail.empCount) {
                    rowData[empIdx] = detail.empCount;
                    newlyFilledCols.add(empIdx);
                    filledStats.empCount++;
                }
                // Source
                if (detail.sourceUrl) {
                    rowData[sourceColIdx] = `비즈노(국세청/지자체 연계) [${detail.sourceUrl}]`;
                    if (!rows[i][sourceColIdx]) {
                        newlyFilledCols.add(sourceColIdx);
                        filledStats.source++;
                    }
                }
            }
        }

        finalCsvRows.push(rowData);

        // Add to worksheet
        const wsRow = worksheet.addRow(rowData);
        wsRow.eachCell((cell, colNum) => {
            const colIdx0 = colNum - 1;
            cell.font = { name: '맑은 고딕', size: 10 };
            cell.alignment = { vertical: 'middle' };

            // Check if this cell was newly filled!
            if (newlyFilledCols.has(colIdx0)) {
                cell.font = {
                    name: '맑은 고딕',
                    size: 10,
                    bold: true,
                    color: { argb: 'FFFF0000' } // RED!
                };
                totalFilledCells++;
            }
        });
    }

    // Auto column widths
    worksheet.columns.forEach((col, idx) => {
        let maxLen = 12;
        worksheet.eachRow({ includeEmpty: false }, row => {
            const cellVal = row.getCell(idx + 1).value;
            if (cellVal) {
                const s = String(cellVal);
                let len = 0;
                for (let c of s) len += c.charCodeAt(0) > 127 ? 2 : 1;
                if (len > maxLen) maxLen = Math.min(len, 60);
            }
        });
        col.width = maxLen + 2;
    });

    console.log(`Writing XLSX to: ${targetXlsxPath}`);
    await workbook.xlsx.writeFile(targetXlsxPath);
    console.log('XLSX written successfully!');

    console.log(`Writing CSV with UTF-8 BOM to: ${targetCsvPath}`);
    const csvContent = '\uFEFF' + finalCsvRows.map(r => toCSVLine(r)).join('\r\n');
    fs.writeFileSync(targetCsvPath, csvContent, 'utf8');
    console.log('CSV written successfully!');

    console.log('\n===== FINAL POPULATION STATISTICS =====');
    console.log(`Total newly filled red cells: ${totalFilledCells}`);
    console.log(JSON.stringify(filledStats, null, 2));
}

module.exports = { processAll };
if (require.main === module) {
    processAll();
}
