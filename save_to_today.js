const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\lg\\Desktop\\Today';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Read the verified TSV content
const tsvContent = fs.readFileSync('busan_companies_phone_verified.tsv', 'utf8');

// 2. Add UTF-8 BOM so Windows Notepad and Excel open it cleanly without encoding issues
const bomTsvContent = '\uFEFF' + tsvContent;

// Target file names
const targetTxtName = '부산기업_전화번호검증_완료본_20261014.txt';
const targetTxtPath = path.join(targetDir, targetTxtName);
fs.writeFileSync(targetTxtPath, bomTsvContent, 'utf8');
console.log('Saved TXT to:', targetTxtPath);

// Also copy the xlsx for convenience
const targetXlsxName = '부산기업_전화번호검증_완료본_20261014.xlsx';
const targetXlsxPath = path.join(targetDir, targetXlsxName);
if (fs.existsSync('busan_companies_phone_verified.xlsx')) {
  fs.copyFileSync('busan_companies_phone_verified.xlsx', targetXlsxPath);
  console.log('Copied XLSX to:', targetXlsxPath);
}

// Verify file sizes
console.log('TXT size:', fs.statSync(targetTxtPath).size, 'bytes');
console.log('XLSX size:', fs.statSync(targetXlsxPath).size, 'bytes');
