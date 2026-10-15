async function parseBizno(bizno) {
  const res = await fetch(`https://bizno.net/article/${bizno}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  
  // extract table rows or key-value pairs
  const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log('Sample text snippet:');
  const idx = clean.indexOf('사업자등록번호');
  if (idx !== -1) {
    console.log(clean.substring(idx, idx + 1000));
  } else {
    console.log(clean.substring(0, 500));
  }
}

parseBizno('6090653247');
