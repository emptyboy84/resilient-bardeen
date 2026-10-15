const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'C:\\Users\\lg\\.gemini\\antigravity\\brain\\22cde527-6a05-4644-ad41-9385bbc0ffd2\\scratch';
const resultsFile = path.join(SCRATCH_DIR, 'verified_results.json');
const missingFile = path.join(SCRATCH_DIR, 'missing_421.json');

const missing = JSON.parse(fs.readFileSync(missingFile, 'utf8'));
const missingMap = {};
missing.forEach(m => { missingMap[String(m.rowNumber)] = m; });

function isValidBizNo(b) {
    if (!b) return false;
    const clean = b.replace(/[^0-9]/g, '');
    if (clean.length !== 10) return false;
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
        sum += Number(clean[i]) * weights[i];
    }
    const d9 = Number(clean[8]) * 5;
    sum += Math.floor(d9 / 10) + (d9 % 10);
    const check = (10 - (sum % 10)) % 10;
    return check === Number(clean[9]);
}

function cleanCompanyName(name) {
    if (!name) return '';
    return name.replace(/\(주\)|주식회사|㈜|\(유\)|유한회사|\(재\)|재단법인|\(사\)|사단법인/g, '')
               .replace(/[\s\-_.,\(\)\[\]]/g, '')
               .toLowerCase();
}

function audit() {
    if (!fs.existsSync(resultsFile)) {
        console.log('Results file does not exist yet.');
        return;
    }
    const data = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
    let validCount = 0;
    let prunedCount = 0;

    for (const key of Object.keys(data)) {
        const item = data[key];
        if (!item.bizno) continue;

        const orig = missingMap[key];
        let rejectReason = null;

        // 1. Checksum
        if (!isValidBizNo(item.bizno)) {
            rejectReason = 'Checksum failed';
        }

        // 2. MUST BE IN BUSAN!
        if (!item.matchedAddress || !item.matchedAddress.includes('부산')) {
            rejectReason = `Not in Busan (${item.matchedAddress || 'No address'})`;
        }

        // 3. Name similarity check
        const targetClean = cleanCompanyName(orig ? orig.name : item.name);
        const matchClean = cleanCompanyName(item.matchedTitle);
        const isNameEqual = (targetClean === matchClean);
        const isSub = (targetClean.includes(matchClean) || matchClean.includes(targetClean));
        if (!isNameEqual && !isSub) {
            rejectReason = `Name mismatch: target="${targetClean}" vs match="${matchClean}"`;
        }

        // 4. Personal name company (e.g. name length <= 4 and same as CEO) must have exact district match
        if (orig && orig.ceo && orig.name === orig.ceo && orig.address) {
            const districtM = orig.address.match(/(해운대구|부산진구|동래구|남구|북구|사상구|사하구|금정구|연제구|수영구|중구|동구|서구|영도구|강서구|기장군)/);
            if (districtM && !item.matchedAddress.includes(districtM[1])) {
                rejectReason = `Personal name company district mismatch: target="${districtM[1]}" vs match="${item.matchedAddress}"`;
            }
        }

        if (rejectReason) {
            console.log(`[PRUNED Row ${key}] "${item.name}" (${item.bizno}) => Rejected: ${rejectReason}`);
            data[key] = {
                rowNumber: Number(key),
                name: item.name,
                bizno: null,
                reason: rejectReason
            };
            prunedCount++;
        } else {
            validCount++;
        }
    }

    fs.writeFileSync(resultsFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\nAudit complete: ${validCount} valid matches preserved, ${prunedCount} false positives pruned.`);
}

module.exports = { audit };
if (require.main === module) {
    audit();
}
