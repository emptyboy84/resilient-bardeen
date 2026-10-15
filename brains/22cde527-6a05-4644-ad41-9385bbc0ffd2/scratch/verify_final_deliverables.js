const fs = require('fs');
const path = require('path');
const ExcelJS = require('C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen\\fill_missing_business_numbers\\node_modules\\exceljs');

const targetXlsxPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.xlsx';
const targetCsvPath = 'C:\\Users\\lg\\Desktop\\오늘\\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑.csv';

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

async function verify() {
    console.log('=== 1. Checking File Existence & Sizes ===');
    const xlsxExists = fs.existsSync(targetXlsxPath);
    const csvExists = fs.existsSync(targetCsvPath);
    console.log(`XLSX Exists: ${xlsxExists} (Size: ${xlsxExists ? fs.statSync(targetXlsxPath).size : 0} bytes)`);
    console.log(`CSV Exists: ${csvExists} (Size: ${csvExists ? fs.statSync(targetCsvPath).size : 0} bytes)`);

    console.log('\n=== 2. Inspecting XLSX Workbook Structure & Red Fonts ===');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(targetXlsxPath);
    const sheet = workbook.getWorksheet(1);

    console.log(`Sheet Name: "${sheet.name}"`);
    console.log(`Total Rows in Sheet: ${sheet.rowCount}`);
    console.log(`Total Columns in Sheet: ${sheet.columnCount}`);

    const header = [];
    sheet.getRow(1).eachCell((cell, colNum) => {
        header.push(cell.value);
    });
    console.log('Header columns:', header);

    const bizColNum = header.indexOf('사업자번호') + 1; // 1-indexed
    console.log(`BizNo column is at 1-indexed position: ${bizColNum}`);

    let redBizNoCount = 0;
    let validBizNoCount = 0;
    let checksumFailures = 0;
    let totalRedCellsAcrossSheet = 0;

    sheet.eachRow((row, rowNum) => {
        if (rowNum === 1) return; // skip header

        // Count all red cells in this row
        row.eachCell((cell, colNum) => {
            const fontColor = cell.font && cell.font.color && cell.font.color.argb;
            if (fontColor === 'FFFF0000') {
                totalRedCellsAcrossSheet++;
                if (colNum === bizColNum) {
                    redBizNoCount++;
                    const val = String(cell.value || '').trim();
                    if (isValidBizNo(val)) {
                        validBizNoCount++;
                    } else {
                        checksumFailures++;
                        console.error(`Row ${rowNum} Checksum Failed: "${val}"`);
                    }
                }
            }
        });
    });

    console.log(`\n=== Verification Findings ===`);
    console.log(`Total rows checked: ${sheet.rowCount - 1}`);
    console.log(`Total RED cells across entire sheet: ${totalRedCellsAcrossSheet}`);
    console.log(`Newly entered RED Business Numbers: ${redBizNoCount}`);
    console.log(`100% Valid Checksums among RED Business Numbers: ${validBizNoCount}`);
    console.log(`Checksum Failures: ${checksumFailures}`);

    if (checksumFailures === 0 && redBizNoCount === 151 && totalRedCellsAcrossSheet > 0) {
        console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
    } else {
        console.warn('\n⚠️ Check counts carefully.');
    }
}

verify().catch(console.error);
