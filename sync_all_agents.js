const fs = require('fs');
const path = require('path');

const agentsContent = `# Behavioral Rules
- 할루시네이션(환각) 금지: 검색 결과나 정보를 제공할 때, 시스템이 반환한 데이터 이외의 가짜 URL이나 거짓 정보를 지어내지 말 것. 출처와 링크는 반드시 실제로 작동하고 검증된 것만 제공할 것.
- 원드라이브(OneDrive) 접근 금지: 어떤 경우에도 C:\\Users\\lg\\OneDrive 및 하위 폴더를 탐색, 검색, 조회, 읽기, 수정하지 말 것. 모든 작업은 지정된 작업 공간(c:\\Users\\lg\\resilient-bardeen) 및 로컬 필수 경로 내에서만 처리할 것.
- 엑셀 프로세스 간섭/종료 금지: 현재 실행 중인 엑셀(Excel, EXCEL.EXE 등) 프로세스를 절대로 강제 종료(kill)하거나 건들지 말 것. 작업 중인 사용자의 문서 상태를 유지할 것.
- 출처 플랫폼 명문화 의무: 비즈노(bizno.net), 머니핀(moneypin.biz), 마켓비즈(marketbz.com), 쿠키딜(cookiedeal.io), WHOIS(whois.kisa.or.kr), 구글링(공식문서/관보), 나이스비즈인포 등 실제 확인한 출처 플랫폼명을 명확히 명시할 것.

# 7단계 하이퍼-검증 파이프라인 (Hyper Verification Protocol)
1. [국세청 홈택스]: 사업자등록 상태(계속/폐업) 및 과세유형 1차 검증
2. [비즈노(Bizno) & 머니핀(Moneypin) & 나이스비즈인포]: 3대 기업원장 전수 크로스체크
3. [마켓비즈 (MarketBZ)]: 직통 엔드포인트(/companyDetail/{사업자번호}) 데이터 파싱
4. [쿠키딜 (CookieDeal)]: B2B 영업 타깃 원장(/company-search/{사업자번호}) 침투 및 데이터 연동
5. [WHOIS 도메인 역추적]: KISA/KRNIC 도메인 실소유자/관리자 연락처 역추적
6. [정밀 구글링 (Google Dorking)]: 지자체 관보, 공공 인허가, 입찰공고, 스마트플레이스 심층 팩트체크
7. [공간·건축물 분석 및 0% 할루시네이션]: 아파트/빌라/자택 1인 사업자는 가짜 번호 생성을 원천 배제하고 정당한 공란 처리, 실제 사업장 3점 일치 번호만 채택

# User Profile
- 사용자의 이름은 '배현명'임.
`;

function syncAgents() {
    const mainPath = 'c:\\Users\\lg\\resilient-bardeen\\AGENTS.md';
    try {
        fs.writeFileSync(mainPath, agentsContent, 'utf8');
        console.log('Updated:', mainPath);
    } catch (e) {
        console.error('Failed main:', e.message);
    }

    const worktreeDir = 'C:\\Users\\lg\\.gemini\\antigravity\\worktrees\\resilient-bardeen';
    if (fs.existsSync(worktreeDir)) {
        const subdirs = fs.readdirSync(worktreeDir);
        for (const sub of subdirs) {
            const fullPath = path.join(worktreeDir, sub);
            if (fs.statSync(fullPath).isDirectory()) {
                const targetFile = path.join(fullPath, 'AGENTS.md');
                try {
                    fs.writeFileSync(targetFile, agentsContent, 'utf8');
                    console.log('Updated:', targetFile);
                } catch (e) {
                    console.error('Failed:', targetFile, e.message);
                }
            }
        }
    }
}

syncAgents();
