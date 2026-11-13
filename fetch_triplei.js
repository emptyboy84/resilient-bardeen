const https = require('https');
const fs = require('fs');

const urls = [
  { name: 'saramin', url: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG6oIjFIn_4g5pxp_F3KvtgkfkPAiZzArJCPP2hvkkU6c9sSJzUbdz_KSD5xZ5pmLIlKaSzTjF43eJrTKNq9UTDnNQ4FoqwNOCcVbnH700w18UWt44vulF_DT8x8Fbr3VK-oMH76DLvRgDX8xHzDu_qb_dRF_JtrQJyKcIh31nAyqYykPbfUViHcAIhisLujaF-IlvFE-s2gA-pRDEd-8dMTclhfd41G-Lynuu1aHU6RhuCX-7uHFkyKPqh89breTjzI8HIbqVDLp6hlwytsA==' },
  { name: 'vcroute', url: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEvNASoHeEJryHiGsK9IFrWHLYMizcymiWhs4mXccbCrnlwgODOmQaOPdhDHtJbH32yW0mxK7XGfTk2QXzpCNLWzylX7NPDaVNFm3R5IrFjWLL2ZFN0IvQHy80JH0xu_NcsVwchiooHNveex17b2A==' },
  { name: 'chungoose', url: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF8_PnoEB6vaNEUxMlj2NWBcgz0TxVUnbAAVl3EAcV9_YTUabJXAIM16t3I2QxwWIQ7ppSpyk6UHMh8hCN1EkGwF8uYDVDzLVOXRD4QRwKtja7ztpuJtHpz' }
];

function fetchOne(item) {
  return new Promise(resolve => {
    https.get(item.url, res => {
      console.log(item.name, 'loc:', res.headers.location);
      if (res.headers.location) {
        https.get(res.headers.location, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        }, r2 => {
          let d = '';
          r2.on('data', c => d += c);
          r2.on('end', () => {
            const phones = d.match(/010[- ]?\d{3,4}[- ]?\d{4}|051[- ]?\d{3,4}[- ]?\d{4}|070[- ]?\d{3,4}[- ]?\d{4}|02[- ]?\d{3,4}[- ]?\d{4}/g) || [];
            console.log(item.name, 'phones:', [...new Set(phones)]);
            const text = d.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
            console.log(item.name, 'text sample:', text.substring(0, 300));
            resolve();
          });
        });
      } else {
        resolve();
      }
    });
  });
}

async function run() {
  for (const u of urls) {
    await fetchOne(u);
  }
}
run();
