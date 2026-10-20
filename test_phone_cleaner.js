function cleanPhoneNumber(raw) {
  if (!raw) return null;
  let p = raw.trim();

  // Remove HTML tags if any
  p = p.replace(/<[^>]+>/g, '').trim();

  // Saramin format: +82 051-602-1700 or +82 51-602-1700 or +82 10-1234-5678
  p = p.replace(/^\+82\s*/, '');
  if (p.startsWith('51-')) p = '0' + p;
  if (p.startsWith('2-')) p = '0' + p;
  if (p.startsWith('10-')) p = '0' + p;
  if (p.startsWith('31-')) p = '0' + p;
  if (p.startsWith('70-')) p = '0' + p;

  // Clean prefixes like 02-1544, 051-1544, 02-1666, etc.
  const prefixMatch = p.match(/^(?:02|051|031)-(1[568][0-9]{2}-[0-9]{4})$/);
  if (prefixMatch) p = prefixMatch[1];

  // Saramin own CS numbers filter
  if (['02-6226-5000', '02-6937-0035', '02-6937-0039', '1577-0000'].includes(p)) {
    return null;
  }

  // Check valid patterns
  // 1. Masked 010: 010-xxxx-x***
  if (/^01[016789]-[0-9]{3,4}-[0-9*]{4}$/.test(p)) {
    return p;
  }

  // 2. Full phone
  const fullRegex = /^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|070|01[016789])-[0-9]{3,4}-[0-9]{4}$|^(15[0-9]{2}|16[0-9]{2}|18[0-9]{2})-[0-9]{4}$|^(050[0-9]?)-[0-9]{3,4}-[0-9]{4}$/;
  if (fullRegex.test(p)) {
    // Avoid bizNo pattern (3-2-5)
    if (/^[0-9]{3}-[0-9]{2}-[0-9]{5}$/.test(p)) return null;
    return p;
  }

  return null;
}

console.log('+82 051-602-1700 ->', cleanPhoneNumber('+82 051-602-1700'));
console.log('+82 51-602-1700 ->', cleanPhoneNumber('+82 51-602-1700'));
console.log('+82 10-5757-9542 ->', cleanPhoneNumber('+82 10-5757-9542'));
console.log('010-7103-1*** ->', cleanPhoneNumber('010-7103-1***'));
console.log('02-1544-1234 ->', cleanPhoneNumber('02-1544-1234'));
console.log('02-6226-5000 ->', cleanPhoneNumber('02-6226-5000'));
