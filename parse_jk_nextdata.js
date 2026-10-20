async function check() {
  const url = 'https://m.jobkorea.co.kr/Recruit/GI_Read/48484633';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    }
  });
  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (match) {
    const json = JSON.parse(match[1]);
    console.log('Next data keys:', Object.keys(json));
    const pageProps = json.props ? json.props.pageProps : {};
    console.log('pageProps keys:', Object.keys(pageProps));
    // stringify and search for phone / 010 / 손기혁
    const str = JSON.stringify(pageProps);
    console.log('str len:', str.length);
    const phones = str.match(/(?:010|051|02|070)-[0-9]{3,4}-[0-9]{4}/g);
    console.log('Phones in NextData:', phones);
    // search for email
    const emails = str.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    console.log('Emails in NextData:', emails);
    // find manager/contact field
    const idx = str.indexOf('manager');
    if (idx !== -1) console.log('Manager snippet:', str.substring(idx - 50, idx + 200));
  } else {
    console.log('No __NEXT_DATA__');
  }
}
check();
