function cleanAddr(addr) {
  if (!addr || addr.includes('*') || addr === '-') return '';
  let cleaned = addr.replace(/\(폐업자는 주소 일부가 \*\* 표시됩니다\)/g, '').trim();
  if (cleaned.includes('*')) return '';
  
  // Remove English address part if present (e.g. "68, Chasang-ro...")
  // English address usually starts after the Korean part with a number followed by English letters/comma
  cleaned = cleaned.replace(/\s+[0-9]+,\s+[A-Za-z0-9\-,\s]+Republic of Korea.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+,\s+[A-Za-z0-9\-,\s]+Korea.*$/i, '');
  
  // Also clean multi-spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

const testAddrs = [
  "경상남도 창원시 의창구  차상로150번길 68 (팔용동, 네오상가) 118호 68, Chasang-ro 150beon-gil, Uichang-gu, Changwon-si, Gyeongsangnam-do, Republic of Korea",
  "대구광역시 북구 영송로 85, 202동 208호 85, Yeongsong-ro, Buk-gu, Daegu, Republic of Korea",
  "부산광역시 사하구 을숙도대로 559 559, Eulsukdo-daero, Saha-gu, Busan, Republic of Korea",
  "경상북도 구미시 산호대로 363",
  "경상북도 구미시 신시로 80-1 (송정동)"
];

testAddrs.forEach(a => {
  console.log('Original:', a);
  console.log('Cleaned: ', cleanAddr(a));
  console.log('---');
});
