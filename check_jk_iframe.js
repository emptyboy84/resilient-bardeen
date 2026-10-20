async function check() {
  const url = 'https://www.jobkorea.co.kr/Recruit/GI_Read/48484633';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  const title = html.match(/<title>(.*?)<\/title>/);
  console.log('Title:', title ? title[1] : 'none');
  const iframe = html.match(/id="gib_frame"[^>]*src="([^"]+)"/);
  console.log('Iframe src:', iframe ? iframe[1] : 'none');
  if (iframe) {
    const iRes = await fetch(iframe[1]);
    const iText = await iRes.text();
    console.log('Iframe len:', iText.length);
    const phones = iText.match(/(?:010|051|02|070)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones in iframe:', phones);
  }
}
check();
