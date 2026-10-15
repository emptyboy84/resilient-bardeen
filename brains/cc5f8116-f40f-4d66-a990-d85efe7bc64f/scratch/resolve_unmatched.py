import json
import urllib.request
import urllib.parse
import re
import time
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

progress_lock = threading.Lock()

def clean_company_name(name):
    if not name: return ""
    clean = re.sub(r'\(주\)|주식회사|\(유\)|\(사\)|\(재\)|\(합\)|\(주식회사\)|（주）|（주교보문고부산점', '', name).strip()
    return clean

def parse_bizno_search(query):
    if not query or len(query.strip()) < 2: return []
    url = f"https://bizno.net/?query={urllib.parse.quote(query.strip())}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
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
        with urllib.request.urlopen(req, timeout=6) as resp:
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

def try_resolve_target(u):
    c_name = clean_company_name(u['name'])
    t_tel = re.sub(r'[^0-9]', '', u.get('tel', ''))
    
    # Let's try multiple queries on Bizno:
    queries = []
    # 1. Phone query
    if t_tel and len(t_tel) >= 7:
        queries.append(t_tel)
        # also try format with hyphens e.g. 051-xxx-xxxx
        if u.get('tel'):
            queries.append(u['tel'])
            
    # 2. Substring or variations of company name
    # e.g. "와이즈온미디어 주식회사" -> "와이즈온미디어"
    # "교보문고"
    # "반다이남코코리아"
    queries.append(c_name)
    if " " in c_name:
        for p in c_name.split():
            if len(p) >= 3 and p not in ["주식회사", "부산지점", "부산사옥", "부산점", "센터"]:
                queries.append(p)
                
    candidates = []
    seen = set()
    for q in queries:
        items = parse_bizno_search(q)
        for it in items:
            if it["biz_no_10"] not in seen:
                seen.add(it["biz_no_10"])
                candidates.append(it)
        if len(candidates) >= 6:
            break
            
    best_cand = None
    best_score = 0
    for c in candidates:
        detail = get_bizno_detail(c['biz_no_10'])
        if not detail: continue
        
        cand_addr = detail.get('addr', '')
        is_busan = "부산" in cand_addr
        
        score = 0
        u_clean = c_name.lower().replace(" ", "")
        d_clean = clean_company_name(detail['title']).lower().replace(" ", "")
        
        if u_clean == d_clean:
            score += 50
        elif u_clean in d_clean or d_clean in u_clean:
            score += 30
            
        # Address matching
        u_addr = u.get('addr', '')
        if is_busan:
            score += 25
        elif not cand_addr:
            score += 10
        else:
            score -= 50
            
        if u.get('sigungu') and u.get('sigungu') in cand_addr:
            score += 20
            
        # Building keywords
        for kw in ["스카이비즈", "아이에스타워", "큐비이센텀", "클래스원", "문화콘텐츠", "센텀", "동의대", "경성대", "부경대", "동아대", "피죤빌딩"]:
            if kw in u_addr and kw in cand_addr:
                score += 30
                break
                
        # Phone matching
        d_tel = re.sub(r'[^0-9]', '', detail.get('tel', ''))
        if t_tel and d_tel and (t_tel == d_tel or t_tel.endswith(d_tel[-7:]) or d_tel.endswith(t_tel[-7:])):
            score += 45
            
        # CEO matching
        u_ceo = u.get('ceo', '').strip()
        d_ceo = detail.get('ceo', '').strip()
        if u_ceo and d_ceo and (u_ceo == d_ceo or u_ceo in d_ceo or d_ceo in u_ceo):
            score += 35
            
        if score > best_score:
            best_score = score
            best_cand = detail
            
    if best_cand and best_score >= 40:
        return {
            "row": u['row'],
            "name": u['name'],
            "status": "matched",
            "score": best_score,
            "biz_no": best_cand['biz_no'],
            "emp_cnt": best_cand['emp_cnt'], # ONLY from Bizno!
            "ceo": best_cand['ceo'] if best_cand['ceo'] else u.get('ceo', ''),
            "est_year": best_cand['est_year'] if best_cand['est_year'] else u.get('est_year', ''),
            "est_month": best_cand['est_month'] if best_cand['est_month'] else u.get('est_month', ''),
            "tel": best_cand['tel'] if best_cand['tel'] else u.get('tel', ''),
            "fax": best_cand['fax'] if best_cand['fax'] else u.get('fax', ''),
            "addr": best_cand['addr'] if best_cand['addr'] else u.get('addr', ''),
            "cand_status": best_cand['status'],
            "closed_date": best_cand['closed_date'],
            "source": "bizno_resolved"
        }
    else:
        return {
            "row": u['row'],
            "name": u['name'],
            "status": "unmatched",
            "score": best_score
        }

def run_secondary():
    with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json", "r", encoding="utf-8") as f:
        targets = json.load(f)
    with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\master_matches.json", "r", encoding="utf-8") as f:
        matches = json.load(f)
        
    unresolved = [t for t in targets if str(t['row']) not in matches or matches[str(t['row'])].get('status') != 'matched']
    print(f"Resolving {len(unresolved)} remaining unmatched targets...", flush=True)
    
    resolved_cnt = 0
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(try_resolve_target, u): u for u in unresolved}
        for fut in as_completed(futures):
            u = futures[fut]
            try:
                res = fut.result()
                if res.get('status') == 'matched':
                    resolved_cnt += 1
                    matches[str(res['row'])] = res
                    print(f"[RESOLVED {resolved_cnt}] Row {res['row']} | {res['name']} -> {res['biz_no']} (Emp: {res['emp_cnt']}, CEO: {res['ceo']})", flush=True)
            except Exception as e:
                print(f"Error {u['name']}: {e}", flush=True)
                
    with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\master_matches.json", "w", encoding="utf-8") as f:
        json.dump(matches, f, ensure_ascii=False, indent=2)
        
    total_matched = sum(1 for v in matches.values() if v.get('status') == 'matched')
    print(f"\nSECONDARY PASS COMPLETE! Newly resolved: {resolved_cnt}, Total Matched: {total_matched} / 318", flush=True)

if __name__ == "__main__":
    run_secondary()
