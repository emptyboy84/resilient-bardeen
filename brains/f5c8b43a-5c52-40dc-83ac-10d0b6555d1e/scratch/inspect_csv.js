const fs = require('fs');

const filePath = "C:\\Users\\lg\\Desktop\\Today\\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_여기까지했어요.csv";

const buf = fs.readFileSync(filePath);
console.log('File size (bytes):', buf.length);

// Check BOM
if (buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    console.log('Detected UTF-8 BOM');
}

// Try utf-8
const utf8Sample = buf.subarray(0, 4000).toString('utf-8');
console.log('UTF-8 sample first 500 chars:');
console.log(utf8Sample.substring(0, 500));

// Also check euc-kr / cp949 decoding
try {
    const iconv = new TextDecoder('euc-kr');
    const euckrSample = iconv.decode(buf.subarray(0, 4000));
    console.log('EUC-KR sample first 500 chars:');
    console.log(euckrSample.substring(0, 500));
} catch (e) {
    console.log('EUC-KR decoder error:', e.message);
}
