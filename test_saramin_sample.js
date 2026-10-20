async function test() {
  const list = [
    { name: '(주)쉐어트리츠', biz: '6258100680' },
    { name: '(주)에스오더', biz: '3558802361' },
    { name: '(주)위너스매니지먼트', biz: '3438802150' },
    { name: '(주)스튜디오정글', biz: '8198602478' },
    { name: '아타드(주)', biz: '5128602989' },
    { name: '오엠엔터프라이즈', biz: '8503200823' },
    { name: '(주)저스티스어드벤처', biz: '1778100390' },
    { name: '(주)에이엠매니지먼트', biz: '3888702272' },
    { name: '(주)메이브릿지', biz: '7518103079' },
    { name: '(주)썬더게임즈', biz: '8678100135' }
  ];

  for (const item of list) {
    const url = 'https://www.saramin.co.kr/zf_user/company-info/view?csn=' + item.biz;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    if (!res.ok) {
      console.log(item.name, item.biz, 'HTTP', res.status);
      continue;
    }
    const html = await res.text();
    const jsonLdMatch = html.match(/"telephone":"\+82\s*([^"]+)"/);
    const dtMatch = html.match(/<dt>전화<\/dt>\s*<dd>([^<]+)<\/dd>/);
    const phone = jsonLdMatch ? jsonLdMatch[1] : (dtMatch ? dtMatch[1].trim() : null);
    console.log(item.name, item.biz, '->', phone || 'None');
  }
}
test();
