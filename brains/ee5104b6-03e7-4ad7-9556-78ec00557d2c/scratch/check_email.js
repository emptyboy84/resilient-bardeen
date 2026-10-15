const dns = require('dns');
const net = require('net');

const email = 'hyeree.amazon@gmail.com';
const domain = email.split('@')[1];

dns.resolveMx(domain, (err, addresses) => {
  if (err || !addresses.length) {
    console.log('DNS MX Error:', err);
    return;
  }
  addresses.sort((a, b) => a.priority - b.priority);
  const mxHost = addresses[0].exchange;
  console.log('MX Host:', mxHost);

  const socket = net.createConnection(25, mxHost);
  socket.setEncoding('utf-8');
  socket.setTimeout(8000);

  let step = 0;
  socket.on('data', (data) => {
    console.log('S:', data.trim());
    if (step === 0 && data.startsWith('220')) {
      step++;
      socket.write('HELO check.com\r\n');
    } else if (step === 1 && data.startsWith('250')) {
      step++;
      socket.write('MAIL FROM:<test@check.com>\r\n');
    } else if (step === 2 && data.startsWith('250')) {
      step++;
      socket.write(`RCPT TO:<${email}>\r\n`);
    } else if (step === 3) {
      console.log('FINAL RCPT RESULT:', data.trim());
      socket.write('QUIT\r\n');
      socket.end();
    }
  });

  socket.on('error', (err) => {
    console.log('Socket error:', err.message);
  });
  socket.on('timeout', () => {
    console.log('Socket timeout (port 25 blocked outbound)');
    socket.destroy();
  });
});
