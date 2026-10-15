import json
import re
import urllib.request
import urllib.parse
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\remaining_targets.json', 'r', encoding='utf-8') as f:
    targets = json.load(f)

def validate_corp_no(val):
    clean = re.sub(r'[^0-9]', '', str(val))
    if len(clean) != 13:
        return False, clean
    weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
    digits = [int(c) for c in clean]
    s = sum(digits[i] * weights[i] for i in range(12))
    chk = (10 - (s % 10)) % 10
    return digits[12] == chk, clean

def cross_lookup_target(t):
    row_idx = t['row_idx']
    name = t['name']
    biz_no = t['biz_no']
    ceo = t['ceo']
    addr = t['addr']
    phone = t['phone']
    corp_no = t['corp_no']
    missing = t['missing']
    
    updates = {}
    
    clean_biz = re.sub(r'[^0-9]', '', str(biz_no))
    
    # 1. Look up by biz_no directly on bizno.net/article/{clean_biz}
    if clean_biz and len(clean_biz) == 10:
        try:
            url = f"https://bizno.net/article/{clean_biz}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=3) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                clean_d = re.sub(r'<[^>]+>', ' ', html)
                clean_d = ' '.join(clean_d.split())
                
                # Check CEO
                if not ceo:
                    m_ceo = re.search(r'대표자명\s*:\s*([가-힣A-Za-z]{2,10})', clean_d)
                    if m_ceo:
                        updates['ceo'] = m_ceo.group(1).strip()
                        
                # Check Address
                if not addr:
                    m_addr = re.search(r'회사주소\s*:\s*([^:]+?)(?:\s+우편번호|\s+홈페이지|\s+전화번호|$)', clean_d)
                    if m_addr:
                        updates['addr'] = m_addr.group(1).strip()
                        
                # Check Phone
                if not phone:
                    m_ph = re.search(r'전화번호\s*:\s*([0-9-]{8,14})', clean_d)
                    if m_ph and m_ph.group(1).strip() not in ['000-000-0000', '00-0000-0000']:
                        updates['phone'] = m_ph.group(1).strip()
                        
                # Check Corp No
                if not corp_no:
                    m_corp = re.search(r'법인등록번호\s*:\s*(\d{6}-\d{7})', clean_d)
                    if m_corp:
                        c_val = m_corp.group(1)
                        if validate_corp_no(c_val)[0]:
                            updates['corp_no'] = c_val
        except:
            pass
            
    # 2. Look up by company name if biz_no search yielded nothing or fields still missing
    still_missing = [m for m in missing if m not in updates]
    if still_missing:
        q_name = re.sub(r'\(주\)|주식회사|㈜|\(사\)|\(재\)|\(의\)', '', name).strip()
        try:
            url = f"https://bizno.net/?query={urllib.parse.quote(q_name)}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=3) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                articles = re.findall(r'/article/(\d{10})', html)
                if articles:
                    det_url = f"https://bizno.net/article/{articles[0]}"
                    dreq = urllib.request.Request(det_url, headers=headers)
                    with urllib.request.urlopen(dreq, timeout=2) as dresp:
                        dhtml = dresp.read().decode('utf-8', errors='ignore')
                        clean_d = ' '.join(re.sub(r'<[^>]+>', ' ', dhtml).split())
                        
                        if not ceo and 'ceo' not in updates:
                            m_ceo = re.search(r'대표자명\s*:\s*([가-힣A-Za-z]{2,10})', clean_d)
                            if m_ceo:
                                updates['ceo'] = m_ceo.group(1).strip()
                                
                        if not addr and 'addr' not in updates:
                            m_addr = re.search(r'회사주소\s*:\s*([^:]+?)(?:\s+우편번호|\s+홈페이지|\s+전화번호|$)', clean_d)
                            if m_addr:
                                updates['addr'] = m_addr.group(1).strip()
                                
                        if not phone and 'phone' not in updates:
                            m_ph = re.search(r'전화번호\s*:\s*([0-9-]{8,14})', clean_d)
                            if m_ph and m_ph.group(1).strip() not in ['000-000-0000', '00-0000-0000']:
                                updates['phone'] = m_ph.group(1).strip()
                                
                        if not corp_no and 'corp_no' not in updates:
                            m_corp = re.search(r'법인등록번호\s*:\s*(\d{6}-\d{7})', clean_d)
                            if m_corp:
                                c_val = m_corp.group(1)
                                if validate_corp_no(c_val)[0]:
                                    updates['corp_no'] = c_val
        except:
            pass
            
    return {
        'row_idx': row_idx,
        'name': name,
        'updates': updates
    }

print(f"Launching deep cross-lookup for {len(targets)} targets across multi-sources...")
start_time = time.time()

cross_results = []
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(cross_lookup_target, t) for t in targets]
    for f in as_completed(futures):
        cross_results.append(f.result())

print(f"Completed cross-lookup in {time.time() - start_time:.2f}s!")
enriched_count = sum(1 for c in cross_results if c['updates'])
print(f"Found new verified data for {enriched_count} companies!")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\cross_lookup_results.json', 'w', encoding='utf-8') as f:
    json.dump(cross_results, f, ensure_ascii=False, indent=2)

print("Saved cross_lookup_results.json successfully.")
