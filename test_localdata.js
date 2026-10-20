async function checkLocalData() {
  const q = '베러아일랜드';
  const url = 'https://www.localdata.go.kr/devcenter/dataSearch.do?opnSvcId=12_04_01_E&keyword=' + encodeURIComponent(q);
  console.log('Searching localdata.go.kr...');
  try {
    const res = await fetch('https://www.localdata.go.kr/platform/rest/TO0/openDataApi?authKey=YOUR_KEY', { method: 'GET' });
    console.log('Localdata test res:', res.status);
  } catch (e) {
    console.log('Localdata error:', e.message);
  }
}
checkLocalData();
