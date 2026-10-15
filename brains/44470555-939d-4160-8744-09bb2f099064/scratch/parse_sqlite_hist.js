const fs = require('fs');
const path = require('path');

const histPath = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\44470555-939d-4160-8744-09bb2f099064\\scratch\\History.db';
const buf = fs.readFileSync(histPath);

const pageSize = buf.readUInt16BE(16);

function readVarint(buffer, offset) {
    let res = 0n;
    let bytesRead = 0;
    for (let i = 0; i < 9; i++) {
        const b = buffer[offset + i];
        bytesRead++;
        if (i === 8) {
            res = (res << 8n) | BigInt(b);
            break;
        }
        res = (res << 7n) | BigInt(b & 0x7F);
        if ((b & 0x80) === 0) break;
    }
    return { value: Number(res), rawBig: res, bytesRead };
}

const entries = [];

for (let pageOffset = 0; pageOffset < buf.length; pageOffset += pageSize) {
    const pageType = buf[pageOffset];
    if (pageType !== 0x0D) continue; // Leaf table page
    
    const numCells = buf.readUInt16BE(pageOffset + 3);
    for (let c = 0; c < numCells; c++) {
        const cellPtr = buf.readUInt16BE(pageOffset + 8 + c * 2);
        let ptr = pageOffset + cellPtr;
        if (ptr >= buf.length) continue;
        
        const pSize = readVarint(buf, ptr);
        ptr += pSize.bytesRead;
        const rowId = readVarint(buf, ptr);
        ptr += rowId.bytesRead;

        const payloadStart = ptr;
        const hSize = readVarint(buf, ptr);
        let hPtr = ptr + hSize.bytesRead;
        const headerEnd = payloadStart + hSize.value;
        
        const serialTypes = [];
        while (hPtr < headerEnd) {
            const st = readVarint(buf, hPtr);
            serialTypes.push(st.value);
            hPtr += st.bytesRead;
        }

        let bodyPtr = headerEnd;
        const cols = [];
        for (const st of serialTypes) {
            if (st === 0) {
                cols.push(null);
            } else if (st === 1) {
                cols.push(buf.readInt8(bodyPtr));
                bodyPtr += 1;
            } else if (st === 2) {
                cols.push(buf.readInt16BE(bodyPtr));
                bodyPtr += 2;
            } else if (st === 3) {
                const v = (buf[bodyPtr] << 16) | (buf[bodyPtr+1] << 8) | buf[bodyPtr+2];
                cols.push(v);
                bodyPtr += 3;
            } else if (st === 4) {
                cols.push(buf.readInt32BE(bodyPtr));
                bodyPtr += 4;
            } else if (st === 5) {
                bodyPtr += 6;
                cols.push(0);
            } else if (st === 6) {
                const high = buf.readUInt32BE(bodyPtr);
                const low = buf.readUInt32BE(bodyPtr + 4);
                const val = BigInt(high) * 0x100000000n + BigInt(low);
                cols.push(val);
                bodyPtr += 8;
            } else if (st === 7) {
                cols.push(buf.readDoubleBE(bodyPtr));
                bodyPtr += 8;
            } else if (st === 8) {
                cols.push(0);
            } else if (st === 9) {
                cols.push(1);
            } else if (st >= 12 && st % 2 === 0) {
                const len = (st - 12) / 2;
                bodyPtr += len;
                cols.push(null);
            } else if (st >= 13 && st % 2 === 1) {
                const len = (st - 13) / 2;
                const str = buf.toString('utf8', bodyPtr, bodyPtr + len);
                cols.push(str);
                bodyPtr += len;
            } else {
                break;
            }
        }

        // Search for string cols that start with http
        for (let i = 0; i < cols.length; i++) {
            if (typeof cols[i] === 'string' && cols[i].startsWith('http')) {
                const url = cols[i];
                const title = (i + 1 < cols.length && typeof cols[i+1] === 'string') ? cols[i+1] : '';
                // Find bigint timestamp in cols
                let date = null;
                for (let j = 0; j < cols.length; j++) {
                    if (typeof cols[j] === 'bigint' && cols[j] > 11644473600000000n) {
                        const ms = Number((cols[j] - 11644473600000000n) / 1000n);
                        date = new Date(ms);
                        break;
                    }
                }
                entries.push({ url, title, date });
                break;
            }
        }
    }
}

entries.sort((a, b) => (b.date || 0) - (a.date || 0));

console.log(`Total URLs found in SQLite pages: ${entries.length}`);
console.log(`\n=== 20 Most Recent History Entries ===`);
entries.slice(0, 20).forEach((e, idx) => {
    console.log(`${idx + 1}. [${e.date ? e.date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : 'Unknown'}]`);
    console.log(`   제목: ${e.title || '(제목 없음)'}`);
    console.log(`   주소: ${e.url}`);
});
