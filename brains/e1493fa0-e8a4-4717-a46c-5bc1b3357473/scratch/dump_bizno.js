async function checkTable() {
  const res = await fetch('https://bizno.net/article/6090653247', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  
  // match table rows
  const regex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const row = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (row) console.log('ROW:', row);
  }
}
checkTable();
