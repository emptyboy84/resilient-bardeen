async function testNuxtApi() {
  const bnos = ['5131909625', '5132200420', '5138144615', '5138531350', '5138602624'];

  for (const bno of bnos) {
    try {
      const url = `https://www.nicebizinfo.com/nuxtApi/search/SR01/sr01M03Get.nice?srchNm=${bno}&srchkwrd=ALL&prn_cnt=10&pge_no=1&useOrgTotal=false`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.nicebizinfo.com/ep/EP0100M001GE.nice?keyword=' + bno,
          'Accept': 'application/json, text/plain, */*'
        }
      });
      const data = await res.json();
      console.log(`BNO ${bno}:`, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error(`Error for ${bno}:`, e);
    }
  }
}

testNuxtApi();
