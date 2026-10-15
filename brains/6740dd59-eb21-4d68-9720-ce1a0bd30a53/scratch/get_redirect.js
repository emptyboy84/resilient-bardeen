const https = require('https');

const redirectUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEvPbmlfAG8N4ZgWkdNFllulAzDMAYx0buVVvlGN8TS25QJ4PwpQhqenBBEcUr_fZZAMU7WihC2PtZ903t92vupyEllGZlY3ZP7g7vadolrpUDa3Gq63hAuUKoH6awi1hIx04k0qmi0mYfqTmk=';

https.get(redirectUrl, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Location:', res.headers.location);
}).on('error', console.error);
