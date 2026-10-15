const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const resultsFile = path.join(SCRATCH_DIR, 'verified_results.json');
const origCsvPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';
const targetXlsxPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = origCsvPath; // Overwrite or update

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

async function buildOutputs() {
    console.log('Loading results from:', resultsFile);
    if (!fs.existsSync(resultsFile)) {
        console.error('resultsFile not found yet!');
        return;
    }
    const verifiedData = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

    console.log('Reading original CSV:', origCsvPath);
    const buffer = fs.readFileSync(origCsvPath);
    const text = new TextDecoder('utf-8').decode(buffer);
    const rows = parseCSV(text);

    console.log(`Original rows: ${rows.length}`);
    const header = rows[0];
    const bizIdx = header.indexOf('사업자번호');
    console.log(`Header: ${header.join(' | ')} (BizNo col: ${bizIdx})`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('부산 CT산업 실태조사');

    // Add header row
    worksheet.addRow(header);
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
        cell.font = { name: '맑은 고딕', size: 10, bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2F2F2' }
        };
    });

    let filledCount = 0;
    const csvOutputRows = [header];

    for (let i = 1; i < rows.length; i++) {
        const rowNum = i + 1;
        const origRow = [...rows[i]];
        const key = String(rowNum);

        let isNewlyFilled = false;
        if (verifiedData[key] && verifiedData[key].bizno) {
            origRow[bizIdx] = verifiedData[key].bizno;
            isNewlyFilled = true;
            filledCount++;
        }

        csvOutputRows.push(origRow);

        // Add to Excel worksheet
        const wsRow = worksheet.addRow(origRow);
        
        // Base styling
        wsRow.eachCell((cell, colNumber) => {
            cell.font = { name: '맑은 고딕', size: 10 };
            cell.alignment = { vertical: 'middle' };
        });

        // If newly filled, set RED font!
        if (isNewlyFilled) {
            const bizCell = wsRow.getCell(bizIdx + 1); // 1-indexed in ExcelJS
            bizCell.font = {
                name: '맑은 고딕',
                size: 10,
                bold: true,
                color: { argb: 'FFFF0000' } // RED!
            };
        }
    }

    // Auto-fit column widths
    worksheet.columns.forEach((column, idx) => {
        let maxLen = 12;
        worksheet.eachRow({ includeEmpty: false }, (row) => {
            const cellVal = row.getCell(idx + 1).value;
            if (cellVal) {
                const s = String(cellVal);
                // Approximate Korean character length
                let len = 0;
                for (let c of s) len += c.charCodeAt(0) > 127 ? 2 : 1;
                if (len > maxLen) maxLen = Math.min(len, 60);
            }
        });
        column.width = maxLen + 2;
    });

    console.log(`Writing XLSX to: ${targetXlsxPath}`);
    await workbook.xlsx.writeFile(targetXlsxPath);
    console.log('XLSX written successfully!');

    console.log(`Writing updated CSV with UTF-8 BOM to: ${targetCsvPath}`);
    const csvContent = '\uFEFF' + csvOutputRows.map(r => toCSVLine(r)).join('\r\n');
    fs.writeFileSync(targetCsvPath, csvContent, 'utf8');
    console.log('CSV written successfully!');

    console.log(`\n==== Summary ====`);
    console.log(`Total rows processed: ${rows.length - 1}`);
    console.log(`Newly filled & colored red: ${filledCount}`);
}

module.exports = { buildOutputs };
if (require.main === module) {
    buildOutputs();
}
