const https = require('https');
const fs = require('fs');

const saraminUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGhaTUyQTRQ0afXI_VZHMFdnH1uE8wFB-u0gWz5WlfCerW5j_pISFCVwJzJUHTSbKHDl4A6QCvYfViqW0dSUcs0a0s6c0mPqZwnBDdmoN9HykWm5XHazfP2vCZayQWAOlUe7eoLOPXfPW4hJLC_4mY3Hmq0Z2Mm0ZHtvHfYcSZ5RYj875zj0jsGnfwgTSbYtYoKP2X4h5AdToEiBklUH35KOT8JB1TkQ-xaPjuMjw_QjxIV1QwPUJiqCJh-AmoP';
const niceUrl = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFkS7DGeqSeJPlkLLBe_ZjFoP-Zjmyjyj5vNGNObX8dZOdhZMp7-gd19VKYvK3rLPbV3pzhr_yN6npYX57-h4QeVBbpaWNiYOqw5nHOAMnOu91uljaxrHXKlgsiJ720LYQY63XEF7pU3G50emBsFz71wQE=';

function fetchRedirect(name, url) {
  return new Promise(resolve => {
    https.get(url, res => {
      console.log(name, 'status:', res.statusCode, 'loc:', res.headers.location);
      if (res.headers.location) {
        https.get(res.headers.location, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        }, r2 => {
          let d = '';
          r2.on('data', c => d += c);
          r2.on('end', () => {
            fs.writeFileSync(`${name}.html`, d);
            console.log(name, 'saved len:', d.length);
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
  await fetchRedirect('saramin_smilebee', saraminUrl);
  await fetchRedirect('nice_smilebee', niceUrl);
}
run();
