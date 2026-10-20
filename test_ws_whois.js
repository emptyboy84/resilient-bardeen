const net = require('net');

function queryWhois(domain) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection(43, 'whois.krnic.net', () => {
      socket.write(domain + '\r\n');
    });
    let data = '';
    socket.on('data', chunk => { data += chunk.toString('utf8'); });
    socket.on('end', () => resolve(data));
    socket.on('error', err => reject(err));
  });
}

async function test() {
  const domains = [
    'wscompany.co.kr', 'wscompany.kr', 'ws-company.co.kr', 'ws-company.kr',
    'ws-c.co.kr', 'wscorp.co.kr', 'wscomp.co.kr', 'ws-corp.co.kr'
  ];
  for (const d of domains) {
    const res = await queryWhois(d);
    const reg = res.match(/등록인\s*:\s*([^\r\n]+)/);
    const phone = res.match(/책임자 전화번호\s*:\s*([^\r\n]+)/);
    const name = res.match(/책임자\s*:\s*([^\r\n]+)/);
    console.log(d, '-> Reg:', reg ? reg[1] : 'NONE', 'Name:', name ? name[1] : 'NONE', 'Phone:', phone ? phone[1] : 'NONE');
  }
}

test();
