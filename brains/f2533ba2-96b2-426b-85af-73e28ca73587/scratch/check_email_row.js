const row = '배현명\t폐업\t센스케이 글로벌(Sense-k Global)\t7780500791\t정정환\t10545\t경기도 고양시 덕양구 향동로 217, DMC플렉스데시앙 (향동동)\t\t\thttps://smartstore.naver.com/michoo\tsuperspirit@nate.com\t\t전자상거래 소매 중개업\t\t\t도매 및 소매업\t소매업; 자동차 제외\t무점포 소매업';
const parts = row.split('\t');
console.log('Cols count:', parts.length);
parts.forEach((p, idx) => console.log(idx + ': ' + p));
