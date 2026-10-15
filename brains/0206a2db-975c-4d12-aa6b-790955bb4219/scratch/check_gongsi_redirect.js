const https = require('https');

const redirectUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGmoaeZsVF-Cpz3w-Ad-63M4vbUXmfaHzw5p6GYfUVwpSV72IPHvtoHv9z_vtdt-kNhI-xRe2-dgYWLEU6B8cmHYCCcpruosYWHbQZssTX_4SlwU6xrbxxyWAL9sQ==';

https.get(redirectUrl, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Location:', res.headers.location);
});
