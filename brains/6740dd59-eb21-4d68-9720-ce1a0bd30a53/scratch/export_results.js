const path = require('path');
const ExcelJS = require('C:/Users/lg/.gemini/antigravity/worktrees/resilient-bardeen/add_kyobo_popup_store/node_modules/exceljs');

async function exportResults() {
  const sourcePath = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx';
  const outPathSummary = 'C:/Users/lg/Desktop/오늘/CT실태조사_파란색기업_정밀실사_매출액검증결과_배현명.xlsx';
  const outPathFullUpdated = 'C:/Users/lg/Desktop/오늘/(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_매출액실사완료.xlsx';

  const verifiedEntities = [
    {
      row: 703,
      name: '주식회사 브이드림',
      originalBiz: '603-10-85753',
      actualBiz: '186-86-00972',
      rep: '김민지',
      phone: '051-714-6866',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 50,
      rev24: 6900000000,
      rev25: 6000000000,
      note: '엑셀 4열 디자인에코 사업자 오기재 정정 / 인크루트·잡코리아 공시',
      source: '사람인/잡코리아/인크루트'
    },
    {
      row: 639,
      name: '디자인에코',
      originalBiz: '603-10-85753',
      actualBiz: '603-10-85753',
      rep: '이돈희',
      phone: '051-518-2080',
      cat: '광고',
      status: '계속사업자',
      emp: 5,
      rev24: 375110000,
      rev25: null,
      note: '대한전문건설협회 공시 실적',
      source: '대한전문건설협회'
    },
    {
      row: 1542,
      name: '산마루(주)',
      originalBiz: '603-81-77971',
      actualBiz: '603-81-77971',
      rep: '이용진, 이미영',
      phone: '051-747-1945',
      cat: '출판',
      status: '계속사업자',
      emp: 4,
      rev24: 355930000,
      rev25: null,
      note: '2022~2023년 공시 기준 (조이트레일)',
      source: '잡코리아'
    },
    {
      row: 1567,
      name: '주식회사 클린스쿨',
      originalBiz: '279-88-01812',
      actualBiz: '279-88-01812',
      rep: '최보필',
      phone: '051-313-1811',
      cat: '출판',
      status: '계속사업자',
      emp: 15,
      rev24: 2100330000,
      rev25: null,
      note: '2024년 결산 기준 (부산벤처타워)',
      source: '사람인/잡코리아/인크루트'
    },
    {
      row: 1630,
      name: '(주)한스이엔지',
      originalBiz: '603-81-24251',
      actualBiz: '603-81-24251',
      rep: '오영훈, 한상남',
      phone: '051-831-2828',
      cat: '애니메이션',
      status: '계속사업자',
      emp: 60,
      rev24: 10420000000,
      rev25: null,
      note: '햇님토이 완구 제조사 / 2019~2020년 공시',
      source: '잡코리아/인크루트'
    },
    {
      row: 1645,
      name: '한솔교육(부산)',
      originalBiz: '604-81-37837',
      actualBiz: '604-81-37837',
      rep: '오규태',
      phone: '051-463-5961',
      cat: '출판',
      status: '계속사업자',
      emp: 12,
      rev24: 3028480000,
      rev25: null,
      note: '2021년 공시 기준',
      source: '인크루트/잡코리아'
    },
    {
      row: 1686,
      name: '비비스로지틱스',
      originalBiz: '835-02-03047',
      actualBiz: '835-02-03047',
      rep: '유성빈',
      phone: '010-4477-9377',
      cat: '방송',
      status: '계속사업자',
      emp: 2,
      rev24: 98973000,
      rev25: null,
      note: '엑셀 기존 기재 건',
      source: '기존 엑셀 기재'
    },
    {
      row: 1732,
      name: '(주)아이지오',
      originalBiz: '876-87-00878',
      actualBiz: '876-87-00878',
      rep: '이재홍',
      phone: '051-361-9989',
      cat: '지식정보',
      status: '계속사업자',
      emp: 8,
      rev24: null,
      rev25: 869000000,
      note: '2025년 기준 (부산지식산업센터 입주)',
      source: '사람인/인크루트'
    },
    {
      row: 1757,
      name: '(주)창비부산',
      originalBiz: '757-85-01489',
      actualBiz: '757-85-01489',
      rep: '신문수',
      phone: '051-714-6866',
      cat: '출판',
      status: '계속사업자',
      emp: 15,
      rev24: 42675000000,
      rev25: null,
      note: '엑셀 기존 기재 건 (창비 지점)',
      source: '기존 엑셀 기재'
    },
    {
      row: 1763,
      name: '새부산기독교서적센타',
      originalBiz: '607-99-75121',
      actualBiz: '607-99-75121',
      rep: '김대희',
      phone: '051-504-4880',
      cat: '출판',
      status: '계속사업자',
      emp: 8,
      rev24: 1318523000,
      rev25: 1408424000,
      note: '엑셀 기존 기재 건 (24/25년 모두 기재)',
      source: '기존 엑셀 기재'
    },
    {
      row: 1773,
      name: '북컬쳐(부산)',
      originalBiz: '622-01-46462',
      actualBiz: '622-01-46462',
      rep: '김광윤',
      phone: '051-808-6147',
      cat: '만화',
      status: '계속사업자',
      emp: 10,
      rev24: 2903290000,
      rev25: null,
      note: '서면점 만화/애니 전문 서점 / 2024년 기준',
      source: '사람인'
    },
    {
      row: 1778,
      name: '주식회사 아트몰링리노베이션',
      originalBiz: '409-87-03113',
      actualBiz: '409-87-03113',
      rep: '김중근',
      phone: '051-999-7500',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 6,
      rev24: 849340000,
      rev25: null,
      note: '사하구 낙동남로 아트몰링 내',
      source: '사람인'
    },
    {
      row: 1786,
      name: '영풍문고 신세계 센텀시티점',
      originalBiz: null,
      actualBiz: '773-86-01800',
      rep: '김경환',
      phone: '051-745-1250',
      cat: '출판',
      status: '계속사업자',
      emp: 430,
      rev24: 149511000000,
      rev25: 145270330000,
      note: '센텀시티몰 B2 입점 / 본사 영풍문고 통합공시',
      source: 'DART/사람인/잡코리아'
    },
    {
      row: 1789,
      name: '（주）교보문고 해운대 팝업스토어',
      originalBiz: null,
      actualBiz: '102-81-11670',
      rep: '안병현',
      phone: '051-709-5958',
      cat: '출판',
      status: '계속사업자',
      emp: 1300,
      rev24: 820000000000,
      rev25: null,
      note: '해운대 NC백화점 입점 / 교보문고 본사 사업자단위과세',
      source: 'DART/비즈노'
    },
    {
      row: 1795,
      name: '노블레스미디어인터내셔날부산',
      originalBiz: null,
      actualBiz: '120-81-48160',
      rep: '명제열',
      phone: '051-747-4475',
      cat: '출판',
      status: '계속사업자',
      emp: 55,
      rev24: 21250000000,
      rev25: null,
      note: '노블레스 매거진 발행사 부산사무소',
      source: '사람인/잡코리아'
    },
    {
      row: 1800,
      name: '케이텍',
      originalBiz: '714-11-01026',
      actualBiz: '714-11-01026',
      rep: '오상민',
      phone: '070-7757-9434',
      cat: '콘텐츠솔루션',
      status: '계속사업자',
      emp: 15,
      rev24: 1988430000,
      rev25: null,
      note: '드론 및 무인이동체 기술 전문',
      source: '사람인'
    },
    {
      row: 1804,
      name: '롯데쇼핑(주)토이저러스 동부산점',
      originalBiz: null,
      actualBiz: '621-85-37733',
      rep: '신동빈, 김상현',
      phone: '051-901-2130',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 20000,
      rev24: 14555900000000,
      rev25: null,
      note: '롯데몰 동부산점 지점 사업자 / 본사: 204-81-32087',
      source: 'DART/국세청'
    },
    {
      row: 1806,
      name: '미디어CAPSULE',
      originalBiz: '607-10-88688',
      actualBiz: '607-10-88688',
      rep: '정태선',
      phone: '051-558-0104',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 7,
      rev24: null,
      rev25: 2200080000,
      note: '인크루트·쿠키딜 실적 교차 확인',
      source: '인크루트/쿠키딜'
    },
    {
      row: 1807,
      name: '(주)삼성출판사 롯데동래점',
      originalBiz: '343-85-00791',
      actualBiz: '343-85-00791',
      rep: '김진용',
      phone: '051-553-4388',
      cat: '출판',
      status: '계속사업자',
      emp: 190,
      rev24: null,
      rev25: 40300000000,
      note: '롯데백화점 6층 마이리틀타이거 지점',
      source: 'DART/인크루트'
    },
    {
      row: 1810,
      name: '주식회사 로파스튜디오',
      originalBiz: null,
      actualBiz: '707-86-02739',
      rep: '최미교',
      phone: '051-711-7131',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 5,
      rev24: null,
      rev25: null,
      note: '부산시 예비사회적기업 (완구/캐릭터)',
      source: '비즈노/국세청'
    },
    {
      row: 1812,
      name: '레고스토어 (센텀시티몰점)',
      originalBiz: null,
      actualBiz: '755-81-00415',
      rep: '이혜진',
      phone: '051-745-1927',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 55,
      rev24: 30000000000,
      rev25: null,
      note: '국내 공식 레고스토어 운영사 주식회사 엘씨엠(LCM)',
      source: '잡코리아/비즈노'
    },
    {
      row: 1815,
      name: '야야토이',
      originalBiz: null,
      actualBiz: '603-85-25388',
      rep: '김영식',
      phone: '051-245-0001',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 25,
      rev24: 3290200000,
      rev25: null,
      note: '주식회사 야야 부산지점 (사하구 장림동)',
      source: 'NICE평가정보/사람인'
    },
    {
      row: 1816,
      name: '또래나라',
      originalBiz: null,
      actualBiz: '141-81-13988',
      rep: '조은희',
      phone: '051-508-8225',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 14,
      rev24: 11200000000,
      rev25: null,
      note: '위니코니(주) 과거 상호 및 현 고객센터 연락처 일치',
      source: 'NICE평가정보/잡코리아'
    },
    {
      row: 1817,
      name: '함께가는사람들김해지점',
      originalBiz: null,
      actualBiz: '605-85-35636',
      rep: '이상덕',
      phone: '051-896-9009',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 4,
      rev24: 400000000,
      rev25: null,
      note: '(주)함께가는사람들 부산지점 (김해본사: 605-81-35642)',
      source: '잡코리아/비즈노'
    },
    {
      row: 1818,
      name: '이소민',
      originalBiz: null,
      actualBiz: null,
      rep: '이소민',
      phone: '010-2801-2662',
      cat: '콘텐츠솔루션',
      status: '계속사업자',
      emp: 1,
      rev24: null,
      rev25: null,
      note: '남구 분포로 113 LG메트로시티 1인 프리랜서',
      source: '실사 검증'
    },
    {
      row: 1820,
      name: '주식회사 하날',
      originalBiz: null,
      actualBiz: '516-81-02666',
      rep: '최유경',
      phone: '010-5850-6025',
      cat: '캐릭터',
      status: '계속사업자',
      emp: 3,
      rev24: null,
      rev25: null,
      note: '부산진구 연수로 56-1 삼빌딩 601호',
      source: '국세청/비즈노'
    },
    {
      row: 1827,
      name: '주식회사 바나나러닝',
      originalBiz: null,
      actualBiz: '895-88-02438',
      rep: '신동재',
      phone: '010-2917-7667',
      cat: '콘텐츠솔루션',
      status: '계속사업자',
      emp: 4,
      rev24: null,
      rev25: null,
      note: '해운대구 마린시티2로 38 / 센텀벤처타운',
      source: '국세청/비즈노'
    }
  ];

  const closedEntities = [
    { row: 126, name: '블루호텔레코딩스튜디오', biz: '627-40-00252', rep: '박정현', cat: '음악', date: '폐업자', note: '국세청 폐업 확인' },
    { row: 619, name: '드림유엔터테인먼트', biz: '287-32-01117', rep: '조휘훈', cat: '음악', date: '2023-12-08', note: '국세청 폐업 확인 (머니핀)' },
    { row: 708, name: '모션박스', biz: '617-81-60182', rep: '박성준', cat: '광고', date: '2015-04-21', note: '수영세무서 폐업 확인' },
    { row: 831, name: '스카이미디어', biz: '504-06-48037', rep: '반승찬', cat: '광고', date: '2008-12-15', note: '국세청 폐업 확인' },
    { row: 1034, name: '위컴퍼니', biz: '607-20-38703', rep: '강현주', cat: '광고', date: '2019-09-30', note: '국세청 폐업 확인' },
    { row: 1051, name: '이노커뮤니케이션즈', biz: '605-19-82721', rep: '윤오동', cat: '광고', date: '2016-06-30', note: '국세청 폐업 확인' },
    { row: 1061, name: '이송', biz: '440-86-00648', rep: '이정석', cat: '광고', date: '2023-05-04', note: '국세청 폐업 확인' },
    { row: 1179, name: '코리아헤럴드내외경제신문', biz: '604-02-56085', rep: '김종욱', cat: '출판', date: '2024-06-30', note: '국세청 폐업 확인' },
    { row: 1342, name: '다인커뮤니케이션즈', biz: '602-02-99846', rep: '이진수', cat: '광고', date: '2021-07-25', note: '국세청 폐업 확인' },
    { row: 1493, name: '태림부산음악사', biz: '607-90-05525', rep: '박정식', cat: '음악', date: '2010-08-31', note: '국세청 폐업 확인' },
    { row: 1589, name: '에스씨제이', biz: '607-81-83801', rep: '윤성원', cat: '출판', date: '2026-06-30', note: '국세청 폐업 확인' },
    { row: 1604, name: '고움', biz: '372-81-00243', rep: '임서현', cat: '출판', date: '2021-01-01', note: '국세청 폐업 확인' },
    { row: 1626, name: '(주)네오테크놀러지', biz: '617-81-43790', rep: '공기정', cat: '콘텐츠솔루션', date: '2018-11-06', note: '국세청 폐업 확인' },
    { row: 1719, name: '제이케이스크린(사직점)', biz: '234-57-00475', rep: '서주동', cat: '게임', date: '2025-02-28', note: '국세청 폐업 확인' },
    { row: 1720, name: '안락스크린골프연습장', biz: '861-10-01121', rep: '김보민', cat: '게임', date: '2023-09-06', note: '국세청 폐업 확인' },
    { row: 1744, name: '레더스', biz: '442-88-01249', rep: '정민근', cat: '광고', date: '2026-07-20', note: '국세청 폐업 확인' },
    { row: 1767, name: '부산일보 당감지국', biz: '605-15-50255', rep: '김재익', cat: '출판', date: '2025-12-20', note: '국세청 폐업 확인' },
    { row: 1793, name: '도서출판CTM', biz: '605-91-52150', rep: '김성철', cat: '출판', date: '2020-07-31', note: '국세청 폐업 확인' },
    { row: 1797, name: '도서출판양업서원', biz: '617-85-19793', rep: '민병선', cat: '출판', date: '2017-12-24', note: '국세청 폐업 확인' },
    { row: 1798, name: '한얼꿈출판사', biz: '607-92-00714', rep: '조서목', cat: '출판', date: '2024-12-31', note: '국세청 폐업 확인' }
  ];

  // 1. Create Summary Workbook
  const wbSummary = new ExcelJS.Workbook();
  wbSummary.creator = '배현명';
  wbSummary.created = new Date();

  // Sheet 1: Verified revenue entities
  const ws1 = wbSummary.addWorksheet('실사_매출액_검증완료');
  ws1.columns = [
    { header: '행번호', key: 'row', width: 10 },
    { header: '사업체명', key: 'name', width: 28 },
    { header: '실제 사업자등록번호', key: 'actualBiz', width: 20 },
    { header: '기존 엑셀 사업자번호', key: 'originalBiz', width: 20 },
    { header: '대표자', key: 'rep', width: 15 },
    { header: '연락처', key: 'phone', width: 16 },
    { header: '업종분류', key: 'cat', width: 15 },
    { header: '사업자상태', key: 'status', width: 14 },
    { header: '종사자수(명)', key: 'emp', width: 14 },
    { header: '2024년 매출액(원)', key: 'rev24', width: 22 },
    { header: '2025년 매출액(원)', key: 'rev25', width: 22 },
    { header: '실사 검증 상세 및 비고', key: 'note', width: 45 },
    { header: '검증 출처', key: 'source', width: 25 }
  ];

  // Style header
  ws1.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws1.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  ws1.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  verifiedEntities.forEach(item => {
    const r = ws1.addRow(item);
    r.getCell('rev24').numFmt = '#,##0';
    r.getCell('rev25').numFmt = '#,##0';
    r.getCell('emp').numFmt = '#,##0';
    r.alignment = { vertical: 'middle' };
  });

  // Sheet 2: Closed entities
  const ws2 = wbSummary.addWorksheet('국세청_폐업확인_20개사');
  ws2.columns = [
    { header: '행번호', key: 'row', width: 10 },
    { header: '사업체명', key: 'name', width: 28 },
    { header: '사업자등록번호', key: 'biz', width: 18 },
    { header: '대표자', key: 'rep', width: 15 },
    { header: '업종분류', key: 'cat', width: 15 },
    { header: '국세청 폐업일', key: 'date', width: 16 },
    { header: '검증 및 처리 의견', key: 'note', width: 40 }
  ];
  ws2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC00000' } };
  ws2.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  closedEntities.forEach(item => {
    const r = ws2.addRow(item);
    r.alignment = { vertical: 'middle' };
  });

  await wbSummary.xlsx.writeFile(outPathSummary);
  console.log('Summary workbook created at:', outPathSummary);

  // 2. Load original workbook and create fully updated version
  const wbOriginal = new ExcelJS.Workbook();
  await wbOriginal.xlsx.readFile(sourcePath);
  const wsOrig = wbOriginal.getWorksheet('기업체 리스트');

  // Map updates by row number
  const vMap = {};
  verifiedEntities.forEach(v => { vMap[v.row] = v; });
  const cMap = {};
  closedEntities.forEach(c => { cMap[c.row] = c; });

  // Update rows
  for (const [rNum, v] of Object.entries(vMap)) {
    const row = wsOrig.getRow(parseInt(rNum));
    if (v.actualBiz && !row.getCell(4).value) row.getCell(4).value = v.actualBiz;
    if (parseInt(rNum) === 703) row.getCell(4).value = v.actualBiz; // fix typo for V-dream
    if (v.rep && !row.getCell(7).value) row.getCell(7).value = v.rep;
    if (v.emp && !row.getCell(16).value) row.getCell(16).value = v.emp;
    if (v.rev24 !== null) row.getCell(17).value = v.rev24;
    if (v.rev25 !== null) row.getCell(18).value = v.rev25;
    if (v.note) {
      const curNote = row.getCell(15).value || '';
      row.getCell(15).value = curNote ? curNote + ' / ' + v.note : v.note;
    }
  }

  for (const [rNum, c] of Object.entries(cMap)) {
    const row = wsOrig.getRow(parseInt(rNum));
    if (c.date) {
      row.getCell(14).value = c.date; // 폐업 날짜 컬럼
      row.getCell(13).value = '폐업'; // 컨택결과
      const curNote = row.getCell(15).value || '';
      row.getCell(15).value = curNote ? curNote + ' / ' + c.note : c.note;
    }
  }

  await wbOriginal.xlsx.writeFile(outPathFullUpdated);
  console.log('Full updated workbook created at:', outPathFullUpdated);
}

exportResults().catch(console.error);
