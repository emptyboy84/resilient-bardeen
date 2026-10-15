const https = require('https');

https.get('https://bizno.net/article/6173390104', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        const metaM = d.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        if (metaM) {
            const text = metaM[1];
            console.log('Full meta description:', text);

            const getField = (label) => {
                const reg = new RegExp(label + '\\s*:\\s*([^:]+?)(?=\\s+[가-힣A-Za-z0-9_()\\/]+?\\s*:|$)', 'i');
                const m = reg.exec(text);
                return m ? m[1].trim() : '';
            };

            const regDate = getField('설립일\\(신고\\/인허가일\\)');
            const tel = getField('전화번호');
            const fax = getField('팩스번호');
            const employees = getField('종업원수');
            const status = getField('사업자 현재 상태\\(※국세청 홈택스 실시간 정보제공\\)');
            const ceo = getField('대표자명');
            const addr = getField('회사주소');

            console.log('Result:');
            console.log('- regDate:', regDate);
            console.log('- tel:', tel);
            console.log('- fax:', fax);
            console.log('- employees:', employees);
            console.log('- status:', status);
            console.log('- ceo:', ceo);
            console.log('- addr:', addr);

            if (regDate) {
                const ym = regDate.match(/([0-9]{4})-([0-9]{2})/);
                if (ym) {
                    console.log('Year:', ym[1], 'Month:', parseInt(ym[2], 10));
                }
            }
        }
    });
});
