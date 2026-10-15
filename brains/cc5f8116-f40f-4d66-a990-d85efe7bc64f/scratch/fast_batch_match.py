import json
import urllib.request
import urllib.parse
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def clean_company_name(name):
    if not name: return ""
    clean = re.sub(r'\(주\)|주식회사|\(유\)|\(사\)|\(재\)|\(합\)|\(주식회사\)|（주）|（주교보문고부산점', '', name).strip()
    return clean

def get_clean_variations(name):
    clean = clean_company_name(name)
    variations = [clean]
    
    # Remove branch suffix
    for suf in ["부산지점", "부산지사", "부산사옥", "부산점", "지점", "지사", "사옥", "센터", "센타", "지국", "팝업스토어", "아틀리에", "스튜디오", "디자인스튜디오", "스토어", "컨트리클럽", "휴게실1", "휴게실"]:
        if clean.endswith(suf) and len(clean) > len(suf):
            variations.append(clean[:-len(suf)].strip())
            
    # Add space-separated variations
    if "스튜디오" in clean and " 스튜디오" not in clean and not clean.startswith("스튜디오"):
        variations.append(clean.replace("스튜디오", " 스튜디오"))
    if "게임즈" in clean and " 게임즈" not in clean:
        variations.append(clean.replace("게임즈", " 게임즈"))
    if "엔터테인먼트" in clean and " 엔터테인먼트" not in clean:
        variations.append(clean.replace("엔터테인먼트", " 엔터테인먼트"))
    if "프로덕션" in clean and " 프로덕션" not in clean:
        variations.append(clean.replace("프로덕션", " 프로덕션"))
        
    return list(dict.fromkeys([v for v in variations if len(v) >= 2]))

def search_bizno_summary(query):
    if not query or len(query.strip()) < 2: return []
    url = f"https://bizno.net/?query={urllib.parse.quote(query.strip())}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=4) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except:
        return []
        
    if '<div class="col-lg-4 sidebar">' in html:
        main_content = html.split('<div class="col-lg-4 sidebar">')[0]
    else:
        main_content = html
        
    posts = re.findall(r'<div class="single-post[\s\S]*?(?=<div class="single-post|<hr>|$)', main_content)
    results = []
    seen = set()
    for p in posts:
        art_match = re.search(r'href=["\']/article/(\d{10})["\']', p)
        if not art_match: continue
        art_id = art_match.group(1)
        if art_id in seen: continue
        seen.add(art_id)
        
        title_match = re.search(r'<h[34][^>]*>(.*?)</h[34]>', p)
        title = re.sub(r'<[^>]+>', '', title_match.group(1)).strip() if title_match else ""
        
        p_match = re.search(r'<p>([\s\S]*?)</p>', p)
        addr_snip = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', p_match.group(1))).strip() if p_match else ""
        
        results.append({
            "biz_no_10": art_id,
            "title": title,
            "addr_snip": addr_snip
        })
    return results

def get_bizno_detail(biz_no_10):
    url = f"https://bizno.net/article/{biz_no_10}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=4) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            
            desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html)
            desc = desc_match.group(1) if desc_match else ""
            
            title_match = re.search(r'<title>(.*?)</title>', html)
            title = title_match.group(1).replace("- 비즈노", "").strip() if title_match else ""
            
            ceo_match = re.search(r'대표자명\s*:\s*([^\s<]+)', desc)
            ceo = ceo_match.group(1).strip() if ceo_match else ""
            
            est_match = re.search(r'설립일[^\:]*:\s*(\d{4})-(\d{2})-(\d{2})', desc)
            est_year = int(est_match.group(1)) if est_match else ""
            est_month = int(est_match.group(2)) if est_match else ""
            
            emp_match = re.search(r'종업원수\s*:\s*(\d+)명', desc)
            emp_cnt = int(emp_match.group(1)) if emp_match else ""
            
            biz_match = re.search(r'사업자등록번호\s*:\s*(\d{3}-\d{2}-\d{5})', desc)
            biz_no = biz_match.group(1) if biz_match else f"{biz_no_10[:3]}-{biz_no_10[3:5]}-{biz_no_10[5:]}"
            
            tel_match = re.search(r'전화번호\s*:\s*([0-9\-]+)', desc)
            tel = tel_match.group(1).strip() if tel_match else ""
            
            fax_match = re.search(r'팩스번호\s*:\s*([0-9\-]+)', desc)
            fax = fax_match.group(1).strip() if fax_match else ""
            
            addr_match = re.search(r'회사주소\s*:\s*(.*?)(?=\s+(?:종업원수|사업자등록번호|법인등록번호|홈페이지|통신판매업번호|$))', desc)
            if not addr_match:
                addr_match = re.search(r'소재지\s*</th>\s*<td[^>]*>(.*?)</td>', html)
            addr = addr_match.group(1).strip() if addr_match else ""
            addr = re.sub(r'<[^>]+>', ' ', addr).strip()
            
            status_match = re.search(r'사업자 현재 상태[^\:]*:\s*([^\s<]+)', desc)
            status = status_match.group(1) if status_match else ""
            
            closed_match = re.search(r'폐업일자\s*:\s*(\d{4})-(\d{2})-(\d{2})', html) or re.search(r'폐업일자\s*:\s*(\d{4})-(\d{2})-(\d{2})', desc)
            closed_date = closed_match.group(1) if closed_match else ""
            
            return {
                "biz_no_10": biz_no_10,
                "biz_no": biz_no,
                "title": title,
                "ceo": ceo,
                "est_year": est_year,
                "est_month": est_month,
                "emp_cnt": emp_cnt,
                "tel": tel,
                "fax": fax,
                "addr": addr,
                "status": status,
                "closed_date": closed_date
            }
    except:
        return None

def evaluate_target(target):
    t_name = target['name']
    t_clean = clean_company_name(t_name).lower().replace(" ", "")
    t_ceo = target.get('ceo', '').strip()
    t_tel = re.sub(r'[^0-9]', '', target.get('tel', ''))
    t_addr = target.get('addr', '')
    
    variations = get_clean_variations(t_name)
    
    # 1. Search summaries
    candidates = []
    seen = set()
    for v in variations:
        summaries = search_bizno_summary(v)
        for s in summaries:
            art_id = s['biz_no_10']
            if art_id in seen: continue
            seen.add(art_id)
            
            s_clean = clean_company_name(s['title']).lower().replace(" ", "")
            # Pre-filter: must have some name similarity OR "부산" in snippet
            if t_clean in s_clean or s_clean in t_clean or "부산" in s['addr_snip']:
                candidates.append(s)
        if len(candidates) >= 5:
            break
            
    # Also if phone exists, search phone
    if t_tel and len(t_tel) >= 7:
        for s in search_bizno_summary(target.get('tel', '')):
            if s['biz_no_10'] not in seen:
                seen.add(s['biz_no_10'])
                candidates.insert(0, s) # priority
                
    # 2. Fetch detail only for viable candidates
    for cand in candidates[:4]:
        d = get_bizno_detail(cand['biz_no_10'])
        if not d: continue
        
        d_clean = clean_company_name(d['title']).lower().replace(" ", "")
        d_tel = re.sub(r'[^0-9]', '', d.get('tel', ''))
        d_ceo = d.get('ceo', '').strip()
        d_addr = d.get('addr', '')
        
        # Exact phone match
        if t_tel and d_tel and (t_tel == d_tel or (len(t_tel) >= 7 and len(d_tel) >= 7 and (t_tel.endswith(d_tel[-7:]) or d_tel.endswith(t_tel[-7:])))):
            return target, d, f"전화번호 일치 ({target.get('tel')})"
            
        # Exact clean name AND Busan address
        if t_clean == d_clean and "부산" in d_addr:
            return target, d, "상호 완전일치 + 부산 주소"
            
        # Exact clean name AND CEO match
        if t_clean == d_clean and t_ceo and d_ceo and (t_ceo == d_ceo or t_ceo in d_ceo or d_ceo in t_ceo):
            return target, d, f"상호 완전일치 + 대표자 일치 ({t_ceo})"
            
        # CEO match AND Busan address AND Partial name
        if t_ceo and d_ceo and (t_ceo == d_ceo or t_ceo in d_ceo or d_ceo in t_ceo) and "부산" in d_addr:
            if len(t_clean) >= 2 and (t_clean in d_clean or d_clean in t_clean):
                return target, d, f"대표자 일치 ({t_ceo}) + 부산 주소 + 상호 부분일치"
                
        # Building match in Busan
        for bld in ["센텀", "문화콘텐츠", "스카이비즈", "아이에스타워", "큐비이센텀", "클래스원", "피죤빌딩", "인텔리움", "에이스하이테크"]:
            if bld in t_addr and bld in d_addr and (t_clean in d_clean or d_clean in t_clean):
                return target, d, f"건물 일치 ({bld}) + 부산 주소"

    return target, None, "미매칭"

if __name__ == "__main__":
    with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\unmatched_132_detail.json", "r", encoding="utf-8") as f:
        unmatched = json.load(f)
        
    print(f"Running fast batch matcher on {len(unmatched)} targets...")
    
    matches = {}
    matched_cnt = 0
    lock = threading.Lock()
    
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(evaluate_target, u): u for u in unmatched}
        for fut in as_completed(futures):
            try:
                target, cand, reason = fut.result()
                if cand:
                    with lock:
                        matched_cnt += 1
                        matches[str(target['row'])] = {
                            "row": target['row'],
                            "name": target['name'],
                            "biz_no": cand['biz_no'],
                            "emp_cnt": cand['emp_cnt'],
                            "ceo": cand['ceo'] if cand['ceo'] else target.get('ceo', ''),
                            "est_year": cand['est_year'] if cand['est_year'] else target.get('est_year', ''),
                            "est_month": cand['est_month'] if cand['est_month'] else target.get('est_month', ''),
                            "tel": cand['tel'] if cand['tel'] else target.get('tel', ''),
                            "fax": cand['fax'] if cand['fax'] else target.get('fax', ''),
                            "addr": cand['addr'] if cand['addr'] else target.get('addr', ''),
                            "cand_status": cand['status'],
                            "closed_date": cand['closed_date'],
                            "match_reason": reason,
                            "source": "bizno_fast_batch"
                        }
                        print(f"[{matched_cnt:2d}] Row {target['row']:4d} | {target['name']} -> {cand['title']} ({cand['biz_no']}) | Emp: {cand['emp_cnt']} | CEO: {cand['ceo']} | 이유: {reason}", flush=True)
            except Exception as e:
                pass
                
    with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\fast_batch_matches.json", "w", encoding="utf-8") as f:
        json.dump(matches, f, ensure_ascii=False, indent=2)
        
    print(f"\nFast Batch Complete! Matched: {matched_cnt} / {len(unmatched)}")
