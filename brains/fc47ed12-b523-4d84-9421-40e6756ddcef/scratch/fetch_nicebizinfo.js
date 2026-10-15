const fs = require('fs');
const path = require('path');
const CryptoJS = require('c:/Users/lg/resilient-bardeen/node_modules/crypto-js');

const rawFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/input_raw.txt';
const cacheFile = 'C:/Users/lg/.gemini/antigravity/brain/fc47ed12-b523-4d84-9421-40e6756ddcef/scratch/nice_cache.json';

const secretKey = "EOyJJlKhWKAwEieaCt7d5ogSTBNNuC7hrkg89A3xOqUhjdmOG8gQrZgmgmu4Xkg8";

function decryptNice(v) {
  if (!v) return null;
  try {
    const [y, E] = [v.slice(0, 32), v.slice(32)];
    const bytes = CryptoJS.AES.decrypt(E, secretKey, {
      iv: CryptoJS.enc.Hex.parse(y),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });
    const text = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

async function fetchBnoNice(bno) {
  try {
    const url = `https://www.nicebizinfo.com/nuxtApi/search/SR01/sr01M03Get.nice?srchNm=${encodeURIComponent(bno)}&srchkwrd=ALL&prn_cnt=10&pge_no=1&useOrgTotal=false`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.nicebizinfo.com/ep/EP0100M001GE.nice?keyword=' + encodeURIComponent(bno),
        'Accept': 'application/json, text/plain, */*'
      }
    });
    const json = await res.json();
    if (json.encryptedResponse) {
      const data = decryptNice(json.encryptedResponse);
      const items = data?.data?.items?.item || [];
      return items;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

async function fetchNameNice(name) {
  try {
    const cleanName = name.replace(/\(주\)|\㈜|주식회사/g, '').trim();
    if (!cleanName || cleanName.length < 2) return [];
    const url = `https://www.nicebizinfo.com/nuxtApi/search/SR01/sr01M03Get.nice?srchNm=${encodeURIComponent(cleanName)}&srchkwrd=ALL&prn_cnt=10&pge_no=1&useOrgTotal=false`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.nicebizinfo.com/ep/EP0100M001GE.nice?keyword=' + encodeURIComponent(cleanName),
        'Accept': 'application/json, text/plain, */*'
      }
    });
    const json = await res.json();
    if (json.encryptedResponse) {
      const data = decryptNice(json.encryptedResponse);
      const items = data?.data?.items?.item || [];
      return items;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

async function run() {
  const lines = fs.readFileSync(rawFile, 'utf8').split(/\r?\n/).filter(l => l.trim().length > 0);
  let cache = {};
  if (fs.existsSync(cacheFile)) {
    try {
      cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch (e) {}
  }

  const tasks = lines.map((line, idx) => {
    const p = line.split('\t');
    const bno = (p[3] || '').replace(/[^0-9]/g, '');
    const name = p[2] || '';
    const rep = p[4] || '';
    return { idx, bno, name, rep };
  });

  console.log(`Starting fetch for ${tasks.length} companies from NiceBizInfo...`);

  // Concurrency worker pool
  const concurrency = 15;
  let currentIndex = 0;
  let successCount = 0;

  async function worker() {
    while (currentIndex < tasks.length) {
      const task = tasks[currentIndex++];
      if (cache[task.bno]) {
        successCount++;
        continue;
      }

      let items = await fetchBnoNice(task.bno);
      if (!items || items.length === 0) {
        // Fallback: search by name
        if (task.name) {
          const nameItems = await fetchNameNice(task.name);
          if (nameItems && nameItems.length > 0) {
            // Find match by representative or bno or best name
            const match = nameItems.find(it => {
              if (it.bizno && task.bno && it.bizno.replace(/[^0-9]/g, '') === task.bno) return true;
              if (it.korreprnm && task.rep && (it.korreprnm === task.rep || it.korreprnm.includes(task.rep.slice(0, 2)))) return true;
              return false;
            }) || nameItems[0];
            items = [match];
          }
        }
      }

      if (items && items.length > 0) {
        cache[task.bno] = items[0];
        successCount++;
      } else {
        cache[task.bno] = { notFound: true };
      }

      if (currentIndex % 25 === 0 || currentIndex === tasks.length) {
        console.log(`Progress: ${currentIndex}/${tasks.length} (${(currentIndex / tasks.length * 100).toFixed(1)}%) - Found: ${successCount}`);
        fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
  console.log(`Finished! Total: ${tasks.length}, NiceBizInfo found: ${successCount}`);
}

run();
