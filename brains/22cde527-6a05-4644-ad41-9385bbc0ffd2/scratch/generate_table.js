const fs = require('fs');

const list = JSON.parse(fs.readFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/filled_companies_summary.json', 'utf8'));

const lines = [
    '| 엑셀 행번호 | 순번 | 구분 | 사업체명 | 사업자등록번호 | 대표자 | 소재지 주소 | 검증 출처 |',
    '| :---: | :---: | :---: | :--- | :---: | :---: | :--- | :--- |'
];

for (const item of list) {
    const rowNum = `**${item.rowNumber}행**`;
    const seq = item.seq ? item.seq : '-';
    const gubun = item.gubun || '-';
    const name = item.name.replace(/\|/g, '&#124;');
    const bizno = `\`${item.bizno}\``;
    const ceo = (item.ceo || '-').replace(/\|/g, '&#124;');
    const addr = (item.address || '-').replace(/\|/g, '&#124;');
    const src = `[링크](${item.source})`;
    lines.push(`| ${rowNum} | ${seq} | ${gubun} | ${name} | ${bizno} | ${ceo} | ${addr} | ${src} |`);
}

fs.writeFileSync('C:/Users/lg/.gemini/antigravity/brain/22cde527-6a05-4644-ad41-9385bbc0ffd2/scratch/rows_table.md', lines.join('\n'), 'utf8');
console.log('Successfully written', lines.length - 2, 'items to rows_table.md');
