async function searchKakaoMap() {
  const q = encodeURIComponent('메이브릿지');
  const url = `https://search.map.kakao.com/mapsearch/map.daum?q=${q}&msFlag=A&sort=0`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  console.log('Kakao Map search status:', res.status);
  const text = await res.text();
  console.log('Kakao Map search length:', text.length);
  try {
    const json = JSON.parse(text);
    console.log('Places count:', json.place ? json.place.length : 0);
    if (json.place) {
      json.place.forEach(p => {
        console.log(`Place: ${p.name} | Phone: ${p.phone} | Address: ${p.address} | Road: ${p.new_address}`);
      });
    }
  } catch(e) {
    console.log('Text preview:', text.substring(0, 500));
  }
}
searchKakaoMap();
