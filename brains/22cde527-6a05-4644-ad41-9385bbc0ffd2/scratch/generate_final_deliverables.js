const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\fill_missing_business_numbers\\node_modules\\exceljs');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const origCsvPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const targetXlsxPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = origCsvPath;

const missingFile = path.join(SCRATCH_DIR, 'missing_421.json');
const originallyMissingList = JSON.parse(fs.readFileSync(missingFile, 'utf8'));
const originallyMissingSet = new Set(originallyMissingList.map(m => m.rowNumber));

const verifiedResultsFile = path.join(SCRATCH_DIR, 'verified_results.json');
const verifiedData = JSON.parse(fs.readFileSync(verifiedResultsFile, 'utf8'));

function isValidBizNo(b) {
    if (!b) return false;
    const clean = b.replace(/[^0-9]/g, '');
    if (clean.length !== 10) return false;
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += Number(clean[i]) * weights[i];
    const d9 = Number(clean[8]) * 5;
    sum += Math.floor(d9 / 10) + (d9 % 10);
    const check = (10 - (sum % 10)) % 10;
    return check === Number(clean[9]);
}

function extractBusanDistrict(address) {
    if (!address) return '';
    const m = address.match(/(해운대구|부산진구|동래구|남구|북구|사상구|사하구|금정구|연제구|수영구|중구|동구|서구|영도구|강서구|기장군)/);
    return m ? m[1] : '';
}

function cleanAddress(addr) {
    if (!addr) return '';
    let a = addr.trim();
    a = a.replace(/\(우\s*:\s*[0-9\-]+\)/g, '').trim();
    if (a.startsWith('부산광역시 ')) a = a.replace(/^부산광역시\s+/, '');
    else if (a.startsWith('부산시 ')) a = a.replace(/^부산시\s+/, '');
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

async function main() {
    console.log('=== Reading CSV ===');
    const buffer = fs.readFileSync(origCsvPath);
    const text = new TextDecoder('utf-8').decode(buffer);
    const rows = parseCSV(text);

    const targetHeader = [
        '구분', '순번', '사업체명', '사업자번호',
        '설립연도(연도)', '설립연도(월)', '대표자 성함',
        '연락처', '팩스번호', '시군구', '주소', '업종분류',
        '컨택결과', '폐업 날짜', '비고',
        '종사자수(명) 25년 기준', '24년 매출액(원)', '25년 매출액(원)',
        '데이터 출처'
    ];
    const origHeader = targetHeader;
    const sourceColIdx = 18;

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

    console.log(`Original rows: ${rows.length - 1}`);

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
            fgColor: { argb: 'FFEAEAEA' }
        };
        cell.border = {
            top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
            left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
            bottom: { style: 'thin', color: { argb: 'FF999999' } },
            right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
        };
    });

    const finalCsvRows = [origHeader];
    let totalNewlyFilledCells = 0;
    const stats = {
        biznoFilled: 0,
        ceoFilled: 0,
        districtFilled: 0,
        addressFilled: 0,
        remarkFilled: 0,
        sourceFilled: 0
    };

    const filledCompanies = [];

    for (let i = 1; i < rows.length; i++) {
        const rowNum = i + 1;
        const key = String(rowNum);
        const rowData = rows[i].slice(0, 18);
        while (rowData.length < 19) rowData.push('');

        const newlyFilledIndices = new Set();
        const isOriginallyMissing = originallyMissingSet.has(rowNum);

        if (isOriginallyMissing) {
            const v = verifiedData[key];
            if (v && v.bizno && isValidBizNo(v.bizno)) {
                rowData[bizIdx] = v.bizno;
                newlyFilledIndices.add(bizIdx);
                stats.biznoFilled++;

                if ((!rowData[ceoIdx] || rowData[ceoIdx].trim() === '') && v.matchedCeo && !v.matchedCeo.includes('*')) {
                    rowData[ceoIdx] = v.matchedCeo;
                    newlyFilledIndices.add(ceoIdx);
                    stats.ceoFilled++;
                }

                if ((!rowData[addrIdx] || rowData[addrIdx].trim() === '') && v.matchedAddress) {
                    rowData[addrIdx] = cleanAddress(v.matchedAddress);
                    newlyFilledIndices.add(addrIdx);
                    stats.addressFilled++;
                }

                if ((!rowData[distIdx] || rowData[distIdx].trim() === '')) {
                    const d = extractBusanDistrict(rowData[addrIdx]);
                    if (d) {
                        rowData[distIdx] = d;
                        newlyFilledIndices.add(distIdx);
                        stats.districtFilled++;
                    }
                }

                if (v.status && v.status.includes('폐업') && (!rowData[remarkIdx] || rowData[remarkIdx].trim() === '')) {
                    rowData[remarkIdx] = '폐업자';
                    newlyFilledIndices.add(remarkIdx);
                    stats.remarkFilled++;
                } else if (v.status && v.status.includes('휴업') && (!rowData[remarkIdx] || rowData[remarkIdx].trim() === '')) {
                    rowData[remarkIdx] = '휴업자';
                    newlyFilledIndices.add(remarkIdx);
                    stats.remarkFilled++;
                }

                if (v.sourceUrl) {
                    rowData[sourceColIdx] = v.sourceUrl;
                    newlyFilledIndices.add(sourceColIdx);
                    stats.sourceFilled++;
                }

                filledCompanies.push({
                    rowNumber: rowNum,
                    seq: rowData[seqIdx],
                    gubun: rowData[gubunIdx],
                    name: rowData[nameIdx],
                    bizno: rowData[bizIdx],
                    ceo: rowData[ceoIdx],
                    address: rowData[addrIdx],
                    source: rowData[sourceColIdx]
                });
            } else {
                // Ensure unverified originally missing rows remain completely blank!
                rowData[bizIdx] = '';
            }
        } else {
            // Already had business number originally
            const hasBiz = rowData[bizIdx];
            if (hasBiz && (!rowData[distIdx] || rowData[distIdx].trim() === '')) {
                const detectedDist = extractBusanDistrict(rowData[addrIdx]);
                if (detectedDist) {
                    rowData[distIdx] = detectedDist;
                    newlyFilledIndices.add(distIdx);
                    stats.districtFilled++;
                }
            }

            if (hasBiz && isValidBizNo(hasBiz) && (!rowData[sourceColIdx] || rowData[sourceColIdx].trim() === '' || rowData[sourceColIdx].includes('bizno.net'))) {
                const digits = hasBiz.replace(/[^0-9]/g, '');
                rowData[sourceColIdx] = `https://bizno.net/article/${digits}`;
                newlyFilledIndices.add(sourceColIdx);
                stats.sourceFilled++;
            }
        }

        finalCsvRows.push(rowData);

        // Add to Excel
        const wsRow = worksheet.addRow(rowData);
        wsRow.eachCell((cell, colNum) => {
            const colIdx0 = colNum - 1;
            cell.alignment = { vertical: 'middle' };

            if (newlyFilledIndices.has(colIdx0)) {
                // RED FONT for newly filled cells!
                cell.font = {
                    name: '맑은 고딕',
                    size: 10,
                    bold: true,
                    color: { argb: 'FFFF0000' } // Pure RED!
                };
                totalNewlyFilledCells++;
            } else {
                cell.font = { name: '맑은 고딕', size: 10 };
            }

            cell.border = {
                top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
            };
        });
    }

    // Auto-fit column widths
    worksheet.columns.forEach((col, idx) => {
        let maxLen = 10;
        worksheet.eachRow({ includeEmpty: false }, row => {
            const cellVal = row.getCell(idx + 1).value;
            if (cellVal) {
                const s = String(cellVal);
                let len = 0;
                for (let c of s) len += c.charCodeAt(0) > 127 ? 2 : 1;
                if (len > maxLen) maxLen = Math.min(len, 55);
            }
        });
        col.width = maxLen + 3;
    });

    console.log(`Writing XLSX to: ${targetXlsxPath}`);
    await workbook.xlsx.writeFile(targetXlsxPath);
    console.log('XLSX written successfully!');

    console.log(`Writing CSV with UTF-8 BOM to: ${targetCsvPath}`);
    const csvContent = '\uFEFF' + finalCsvRows.map(r => toCSVLine(r)).join('\r\n');
    fs.writeFileSync(targetCsvPath, csvContent, 'utf8');
    console.log('CSV written successfully!');

    console.log('\n===== FINAL POPULATION STATISTICS =====');
    console.log(`Total rows in dataset: ${rows.length - 1}`);
    console.log(`Total newly filled cells (styled with RED font): ${totalNewlyFilledCells}`);
    console.log(JSON.stringify(stats, null, 2));

    fs.writeFileSync(path.join(SCRATCH_DIR, 'filled_companies_summary.json'), JSON.stringify(filledCompanies, null, 2), 'utf8');
    console.log(`Saved summary of ${filledCompanies.length} filled companies to scratch/filled_companies_summary.json`);
}

main().catch(err => {
    console.error('Error:', err);
});
