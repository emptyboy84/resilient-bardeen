const https = require('https');

const redirectUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHEFZHDE9cywnjqaUAsbSXNEhYDuUO6Ey49W2EYBeFR8V_u9BK_Gm1vtD0KtzPh-zqxlJuepyZ59lPpMP9KKJAtMJPDi87ku69iXoEjZLwV8gj9RsFDNcKABeqFDYd9wsf3bzzS5E322CKiQpeF_4RKZbvYBmCVhD4QLImpqPisbG5br1ZaXFgDj5ZrIuo3Pce3qbIMMObB70R_pO5a02JpKEPizvz_PEBKSmdKC0zFMdiHmkTPl8nhZp_GxXCkRzIOZekbkpDRnrDqOR7J01TuSbUROe8WzFJDy59ILSuYj3fdw1huozUg8n86ZDOoy2ysYdXBeJbCke1Sv7w3ehIoCxZ9OCn6T2Tj4BJzswXPSUdjCKgv';

https.get(redirectUrl, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Location:', res.headers.location);
});
