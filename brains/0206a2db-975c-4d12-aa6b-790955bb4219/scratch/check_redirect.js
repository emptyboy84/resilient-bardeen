const https = require('https');

const url = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF_-svOcmDpZGlktLG96I3iXVWVo_j-nO8vPDZjCH2Wf0F0D6wyk-msh6GLAkr3QU57uifOal_--mh065b_GUOkjGEzj5i9LhrSzeXwy7tZ045nYVlgBkVaP2ddu-XStxtKkrp-AtKqjq4nMAs45r5DDjykw_JxRGjX0M6i0e-7H3lNKJZlBA==';

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Location:', res.headers.location);
});
