// Researching public revenue datasets in Korea
// 1. DART (Open DART API): Requires API key, covers only external audit corporations (외감법인)
// 2. G2B (조달청 나라장터): http://data.go.kr - 조달청 계약/입찰 기업 실적 및 재무정보
// 3. National Pension Service (국민연금공단 국민연금 가입 사업장 내역): 공개데이터에 사업장명, 사업자등록번호 앞6자리, 업종, 주소, 당월고지보험료(원), 가입자수(명) 제공
//    - Note: 국민연금 고지보험료를 통해 월 소득총액(소득구간) 추정은 가능하나 '매출액' 자체는 아님
// 4. K-Report / CRETOP / NICE Bizinfo: Corporate credit bureau DBs (commercial/paid for financial statements)
console.log('Public revenue research module initialized.');
