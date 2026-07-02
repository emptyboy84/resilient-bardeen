import fs from 'fs';

const raw = fs.readFileSync('final_filtered_results.txt', 'utf-8');
const lines = raw.trim().split('\n');

let md = '# 스크래핑 결과 요약 (Walkthrough)\n\n';
md += '성공적으로 전체 약 146건(빈칸 포함)의 기존 업체 주소지를 조회하여 카카오맵 기준 **제조업 관련 업체**를 매칭했습니다. 필터링 로직을 통해 은행, 편의점, 아파트 등의 비제조 시설은 제외하였습니다.\n\n';
md += '> [!NOTE]\n';
md += '> 삼성중공업이나 한화오션(구 대우조선해양) 야드 내부에 위치했던 협력업체들의 경우, 해당 조선소 본사 또는 다른 사내 협력업체들이 대체로 검색되었습니다.\n\n';

md += '보기 편하도록 깔끔한 표(Table) 형태로 정리해 드립니다.\n\n';
md += '| 기존 업체명 | 주소지 | 발견된 대체 제조업체 (연락처) |\n';
md += '| :--- | :--- | :--- |\n';

for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length >= 3) {
        md += `| **${parts[0]}** | ${parts[1]} | ${parts[2]} |\n`;
    }
}

fs.writeFileSync('C:\\Users\\lg\\.gemini\\antigravity\\brain\\3781c7a1-4e93-4673-8498-39b3fe291378\\walkthrough.md', md, 'utf-8');
console.log('Markdown generated.');
