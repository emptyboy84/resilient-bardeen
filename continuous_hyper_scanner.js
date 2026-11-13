const ExcelJS = require('exceljs');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetFiles = [
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_latest_updated.xlsx',
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_배현명.xlsx',
    'C:\\Users\\lg\\Desktop\\Today\\크레탑_부산CT산업현황_261012_전략팀 전달_최신동기화본.xlsx'
];

const logFile = 'C:\\Users\\lg\\Desktop\\Today\\전수검증_진행기록.txt';

function appendLog(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}\n`;
    console.log(msg);
    try {
        fs.appendFileSync(logFile, line, 'utf8');
    } catch (e) {}
}

function fetchUrl(url, timeoutMs = 6000) {
    return new Promise(resolve => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: timeoutMs
        }, res => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let nextUrl = res.headers.location;
                if (!nextUrl.startsWith('http')) {
                    nextUrl = new URL(nextUrl, url).toString();
                }
                return resolve(fetchUrl(nextUrl, timeoutMs));
            }
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => resolve({ status: res.statusCode, body: d }));
        });
        req.on('error', () => resolve({ status: 500, body: '' }));
        req.on('timeout', () => { req.destroy(); resolve({ status: 408, body: '' }); });
    });
}

async function queryBizno(bno) {
    if (!bno) return { phone: null, status: null };
    const cleanNo = bno.replace(/[^0-9]/g, '');
    if (cleanNo.length !== 10) return { phone: null, status: null };

    const res = await fetchUrl(`https://bizno.net/article/${cleanNo}`);
    if (res.status !== 200 || !res.body) return { phone: null, status: null };

    // 1. Status
    let status = null;
    const statusMatch = res.body.match(/<th>\s*사업자\s*현재\s*상태\s*<\/th>\s*<td>([\s\S]*?)<\/td>/i);
    if (statusMatch) {
        const text = statusMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (text.includes('폐업')) status = '폐업';
        else if (text.includes('휴업')) status = '휴업';
        else if (text.includes('계속')) status = '정상';
    }

    // 2. Phone
    let phone = null;
    const phoneMatch = res.body.match(/<th>\s*전화번호\s*<\/th>\s*<td>\s*([^<]+)\s*<\/td>/i);
    if (phoneMatch) {
        const raw = phoneMatch[1].trim();
        if (raw && raw !== '-' && !raw.includes('없음') && /\d{2,3}[-)]\d{3,4}[-]\d{4}/.test(raw)) {
            phone = raw;
        }
    }

    return { phone, status };
}

async function saveToExcel(updates) {
    if (updates.length === 0) return;

    for (const filePath of targetFiles) {
        if (!fs.existsSync(filePath)) continue;
        try {
            const wb = new ExcelJS.Workbook();
            await wb.xlsx.readFile(filePath);
            const ws = wb.worksheets[0];

            for (const u of updates) {
                const row = ws.getRow(u.row);

                // Update Status (Col 4) if changed (e.g. 폐업, 휴업)
                if (u.newStatus && u.newStatus !== '정상') {
                    const statusCell = row.getCell(4);
                    statusCell.value = u.newStatus;
                    statusCell.font = {
                        color: { argb: 'FFFF0000' }, // Red text for closed/suspended
                        bold: true,
                        size: statusCell.font ? statusCell.font.size : 10,
                        name: statusCell.font ? statusCell.font.name : '맑은 고딕'
                    };
                }

                // Update Phone (Col 10) if found and currently empty
                if (u.newPhone) {
                    const phoneCell = row.getCell(10);
                    // Only update if current value is empty or not user red text
                    const currentColor = phoneCell.font?.color?.argb;
                    if (!phoneCell.value || currentColor !== 'FFFF0000') {
                        phoneCell.value = u.newPhone;
                        phoneCell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFC6EFCE' } // Single cell green highlight
                        };
                        phoneCell.font = {
                            color: { argb: 'FF006100' },
                            bold: true,
                            size: phoneCell.font ? phoneCell.font.size : 10,
                            name: phoneCell.font ? phoneCell.font.name : '맑은 고딕'
                        };
                    }
                }
            }

            await wb.xlsx.writeFile(filePath);
            appendLog(`[엑셀저장성공] ${path.basename(filePath)} 에 ${updates.length}건 실시간 동기화 완료`);
        } catch (e) {
            appendLog(`[엑셀저장에러] ${path.basename(filePath)}: ${e.message}`);
        }
    }
}

async function runContinuousScan() {
    appendLog('================================================================');
    appendLog('>>> 7단계 하이퍼-검증 파이프라인: 순번 1번 ~ 3978번 전수 누락 추적 및 폐업/휴업 검증 개시 <<<');
    appendLog('================================================================');

    const primaryFile = targetFiles[0];
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(primaryFile);
    const ws = wb.worksheets[0];

    const targets = [];
    for (let r = 2; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        const seq = row.getCell(1).value;
        const name = row.getCell(2).value;
        const ceo = row.getCell(3).value;
        const curStatus = row.getCell(4).value;
        const bno = row.getCell(6).value;
        const phone = row.getCell(10).value;

        // Missing phone target
        if (!phone || String(phone).trim() === '') {
            targets.push({ row: r, seq, name, ceo, curStatus, bno });
        }
    }

    appendLog(`총 대상 건수: ${targets.length}건 (순번 1번부터 3978번까지 미입력분 전수)`);

    let processed = 0;
    let foundPhoneCount = 0;
    let closedCount = 0;
    let suspendedCount = 0;
    let pendingUpdates = [];

    const BATCH_SIZE = 4; // Controlled concurrent batch
    const DELAY_MS = 250;

    for (let i = 0; i < targets.length; i += BATCH_SIZE) {
        const chunk = targets.slice(i, i + BATCH_SIZE);
        const promises = chunk.map(async t => {
            const res = await queryBizno(t.bno);
            let hasUpdate = false;
            let updateItem = { row: t.row, seq: t.seq, name: t.name, bno: t.bno };

            // Check status change
            if (res.status && res.status !== '정상' && res.status !== t.curStatus) {
                updateItem.newStatus = res.status;
                hasUpdate = true;
                if (res.status === '폐업') closedCount++;
                if (res.status === '휴업') suspendedCount++;
                appendLog(`[상태변경감지] Seq ${t.seq} (Row ${t.row}) ${t.name}: ${t.curStatus || '정상'} -> ${res.status}`);
            }

            // Check phone found
            if (res.phone) {
                updateItem.newPhone = res.phone;
                hasUpdate = true;
                foundPhoneCount++;
                appendLog(`[전화번호발굴] Seq ${t.seq} (Row ${t.row}) ${t.name} (${t.ceo}) [${t.bno}] -> ${res.phone}`);
            }

            return hasUpdate ? updateItem : null;
        });

        const results = await Promise.all(promises);
        for (const r of results) {
            if (r) pendingUpdates.push(r);
        }

        processed += chunk.length;

        // Periodic save every 25 updates or every 100 targets
        if (pendingUpdates.length >= 20 || (processed % 100 === 0 && pendingUpdates.length > 0)) {
            appendLog(`>>> 진행상황: ${processed}/${targets.length} 처리 중 (발굴번호: ${foundPhoneCount}건, 폐업/휴업: ${closedCount + suspendedCount}건) - 중간 저장 실행 <<<`);
            await saveToExcel(pendingUpdates);
            pendingUpdates = [];
        } else if (processed % 50 === 0) {
            appendLog(`진행상황: ${processed}/${targets.length} (${((processed / targets.length) * 100).toFixed(1)}%) 처리 중...`);
        }

        // Polite delay
        await new Promise(r => setTimeout(r, DELAY_MS));
    }

    // Final flush
    if (pendingUpdates.length > 0) {
        await saveToExcel(pendingUpdates);
        pendingUpdates = [];
    }

    appendLog('================================================================');
    appendLog(`>>> 전수 스캔 및 검증 완료 보고 <<<`);
    appendLog(`- 총 검증 대상: ${targets.length}건`);
    appendLog(`- 신규 전화번호 발굴: ${foundPhoneCount}건 (연초록 서식 일괄 적용)`);
    appendLog(`- 폐업자 식별: ${closedCount}건 (빨간색 상태 서식 적용)`);
    appendLog(`- 휴업자 식별: ${suspendedCount}건`);
    appendLog('================================================================');
}

runContinuousScan().catch(err => {
    appendLog(`[치명적에러] ${err.stack || err.message}`);
});
