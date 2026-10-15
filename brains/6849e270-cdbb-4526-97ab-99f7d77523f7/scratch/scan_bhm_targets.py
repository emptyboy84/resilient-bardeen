import json
import re
import urllib.request
import urllib.parse
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bhm_1000_raw.json', 'r', encoding='utf-8') as f:
    rows = json.load(f)

def validate_biz_no(val):
    clean = re.sub(r'[^0-9]', '', str(val))
    if len(clean) != 10:
        return False, clean
    weights = [1, 3, 7, 1, 3, 7, 1, 3, 5]
    digits = [int(c) for c in clean]
    s = sum(digits[i] * weights[i] for i in range(8))
    s += (digits[8] * 5) // 10 + (digits[8] * 5) % 10
    chk = (10 - (s % 10)) % 10
    return digits[9] == chk, clean

def validate_corp_no(val):
    clean = re.sub(r'[^0-9]', '', str(val))
    if len(clean) != 13:
        return False, clean
    weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
    digits = [int(c) for c in clean]
    s = sum(digits[i] * weights[i] for i in range(12))
    chk = (10 - (s % 10)) % 10
    return digits[12] == chk, clean

corp_keywords = ['주식회사', '(주)', '㈜', '사단법인', '재단법인', '의료법인', '학교법인', '사회복지법인', '협동조합', '(사)', '(재)', '(의)', '(학)', '(복)', '유한회사', '유한책임회사', '농업회사법인']

# Identify rows needing enrichment
targets_to_enrich = []
for r in rows:
    needs_enrich = False
    reasons = []
    
    # 1. Biz no check
    is_v, _ = validate_biz_no(r['biz_no'])
    if not is_v:
        needs_enrich = True
        reasons.append("사업자번호체크섬오류")
        
    # 2. Corp no check
    is_corp = any(kw in r['name'] for kw in corp_keywords)
    if is_corp and not r['corp_no']:
        needs_enrich = True
        reasons.append("법인번호누락")
    elif r['corp_no']:
        is_cv, _ = validate_corp_no(r['corp_no'])
        if not is_cv:
            needs_enrich = True
            reasons.append("법인번호체크섬오류")
            
    # 3. Missing critical fields
    if not r['ceo']:
        needs_enrich = True
        reasons.append("대표자누락")
    if not r['addr']:
        needs_enrich = True
        reasons.append("주소누락")
    if not r['settle'] and r['corp_no']:
        r['settle'] = '12월' # auto default for corp
        
    if needs_enrich:
        targets_to_enrich.append({
            'local_id': r['local_id'],
            'master_row': r['master_row'],
            'name': r['name'],
            'biz_no': r['biz_no'],
            'ceo': r['ceo'],
            'addr': r['addr'],
            'corp_no': r['corp_no'],
            'reasons': reasons
        })

print(f"Total rows requiring enrichment/lookup: {len(targets_to_enrich)}")
with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\enrichment_targets.json', 'w', encoding='utf-8') as f:
    json.dump(targets_to_enrich, f, ensure_ascii=False, indent=2)

print("Saved enrichment_targets.json successfully.")
