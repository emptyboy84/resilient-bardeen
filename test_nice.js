async function checkNiceBiz() {
  const url = 'https://www.nicebizinfo.com/api/search/company?query=1778100390';
  // Let's test nicebizinfo search
  try {
    const res = await fetch('https://www.nicebizinfo.com/api/search/company?query=' + encodeURIComponent('저스티스어드벤처'), {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log('Nice status:', res.status);
    const data = await res.text();
    console.log('Nice data:', data.substring(0, 500));
  } catch(e) {
    console.log('Err:', e.message);
  }
}
checkNiceBiz();
