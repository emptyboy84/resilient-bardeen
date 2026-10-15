function cleanUrl(str) {
  if (!str) return '';
  str = str.trim();
  if (str === '-' || str === '.' || str.includes('*')) return '';
  if (str === 'http://' || str === 'https://' || str === 'http://-' || str === 'https://-') return '';
  if (!str.startsWith('http://') && !str.startsWith('https://')) {
    str = 'http://' + str;
  }
  if (str.replace(/^https?:\/\//, '').length < 4) return '';
  return str;
}

function cleanEmail(str) {
  if (!str) return '';
  str = str.trim();
  if (str === '0' || str === '-' || str === '.' || str.includes('*')) return '';
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str)) return '';
  return str;
}

function cleanPhone(str) {
  if (!str) return '';
  let cleaned = str.replace(/\(※[^\)]*\)/g, '').replace(/[^0-9\-~,\s]/g, '').trim();
  if (cleaned.includes('*') || cleaned === '-' || cleaned === '.' || cleaned.length < 8) return '';
  // Check digit count
  const digits = cleaned.replace(/[^0-9]/g, '');
  if (digits.startsWith('010') && digits.length < 10) return '';
  if (digits.startsWith('02') && digits.length < 9) return '';
  if (digits.length < 8 || digits.length > 12) return '';
  return cleaned;
}

function cleanAddr(addr) {
  if (!addr || addr.includes('*') || addr === '-') return '';
  let cleaned = addr.replace(/\(폐업자는 주소 일부가 \*\* 표시됩니다\)/g, '').trim();
  if (cleaned.includes('*')) return '';
  
  // Remove English address part if present
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+Republic of Korea.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+Korea.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+beon-gil.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+-ro.*$/i, '');
  cleaned = cleaned.replace(/\s+[0-9]+(-[0-9]+)?,\s+[A-Za-z0-9\-,\s]+-gil.*$/i, '');
  
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

console.log('cleanUrl("http://"):', cleanUrl('http://'));
console.log('cleanEmail("0"):', cleanEmail('0'));
console.log('cleanPhone("0103421"):', cleanPhone('0103421'));
console.log('cleanAddr row 50:', cleanAddr('경상북도 경산시 평산1길 37-35(평산동) 37-35, Pyeongsan 1-gil, Gyeongsan-si, Gyeongsangbuk-do, Republic of Korea'));
console.log('cleanAddr row 499:', cleanAddr('경상남도 김해시 상동면 동북로1007번길 8-4 8-4, Dongbuk-ro 1007beon-gil, Sangdong-myeon, Gimhae-si, Gyeongsangnam-do, Republic of Korea'));
