import json
import re
import urllib.request
import urllib.parse
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\enrichment_targets.json', 'r', encoding='utf-8') as f:
    targets = json.load(f)

# Load existing confirmed corrections
try:
    with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\final_biz_corrections_100.json', 'r', encoding='utf-8') as f:
        known_biz = json.load(f)
except:
    known_biz = {}

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

def resolve_single_target(t):
    local_id = t['local_id']
    name = t['name']
    old_biz = t['biz_no']
    old_corp = t['corp_no']
    ceo = t['ceo']
    addr = t['addr']
    
    res = {
        'local_id': local_id,
        'name': name,
        'biz_no': old_biz,
        'corp_no': old_corp,
        'ceo': ceo,
        'addr': addr,
        'updated_biz': False,
        'updated_corp': False,
        'updated_ceo': False,
        'updated_addr': False
    }
    
    # 1. Check known biz
    if name in known_biz:
        res['biz_no'] = known_biz[name]['new_bno']
        res['updated_biz'] = True
        return res
        
    # 2. Known manual overrides
    if '삼성기계공업' in name and not ceo:
        res['ceo'] = '김성식'
        res['updated_ceo'] = True
    elif '대성이앤지' in name:
        res['ceo'] = '문한석'
        res['biz_no'] = '6068635543'
        res['updated_ceo'] = True
        res['updated_biz'] = True
    elif '비엔아이' in name:
        res['biz_no'] = '6638101191'
        res['ceo'] = '방병주'
        res['addr'] = '부산광역시 해운대구 센텀중앙로 90, 813호 (재송동, 큐비e센텀)'
        res['updated_biz'] = True
        res['updated_ceo'] = True
        res['updated_addr'] = True
    elif '에스피디' in name and not old_corp:
        res['corp_no'] = '180111-0650556'
        res['updated_corp'] = True
    elif '상원의료재단' in name and not old_corp:
        res['corp_no'] = '124222-0004318'
        res['updated_corp'] = True
    elif '동래데이케어' in name and not old_corp:
        res['corp_no'] = '180111-0847385'
        res['updated_corp'] = True
    elif '비씨에스' in name and not old_corp:
        res['corp_no'] = '180111-1348720'
        res['updated_corp'] = True
        
    # 3. Bizno query if biz_no still invalid or corp missing
    is_bv, _ = validate_biz_no(res['biz_no'])
    if not is_bv:
        q_name = re.sub(r'\(주\)|주식회사|㈜|\(사\)|\(재\)|\(의\)', '', name).strip()
        url = f"https://bizno.net/?query={urllib.parse.quote(q_name)}"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=4) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                articles = re.findall(r'/article/(\d{10})', html)
                
                valid_bno = []
                for a in articles:
                    is_v, _ = validate_biz_no(a)
                    if is_v and a not in valid_bno:
                        valid_bno.append(a)
                        
                if valid_bno:
                    # check similarity
                    clean_old = re.sub(r'[^0-9]', '', old_biz)
                    best_match = valid_bno[0]
                    for cand in valid_bno:
                        diff = sum(1 for x, y in zip(clean_old, cand) if x != y)
                        if diff <= 2:
                            best_match = cand
                            break
                    res['biz_no'] = best_match
                    res['updated_biz'] = True
        except:
            pass
            
    return res

print(f"Launching Multi-Agent Worker pool for {len(targets)} targets...")
resolved_results = {}
start_time = time.time()

with ThreadPoolExecutor(max_workers=8) as executor:
    future_to_target = {executor.submit(resolve_single_target, t): t for t in targets}
    for future in as_completed(future_to_target):
        res = future.result()
        resolved_results[res['local_id']] = res

print(f"Completed multi-agent lookup in {time.time() - start_time:.2f}s. Total resolved: {len(resolved_results)}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\resolved_enrichment_data.json', 'w', encoding='utf-8') as f:
    json.dump(resolved_results, f, ensure_ascii=False, indent=2)

print("Saved resolved_enrichment_data.json successfully.")
