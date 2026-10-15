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
    clean = re.sub(r'\(주\)|주식회사|\(유\)|\(사\)|\(재\)|\(합\)|\(주식회사\)', '', name).strip()
    return clean

def parse_search_page(query):
    if not query or len(query.strip()) < 2:
        return []
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
            
            closed_match = re.search(r'폐업일자\s*:\s*(\d{4}-\d{2}-\d{2})', html) or re.search(r'폐업일자\s*:\s*(\d{4}-\d{2}-\d{2})', desc)
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

def candidate_looks_promising(target, cand):
    t_name = clean_company_name(target['name']).lower().replace(" ", "")
    c_title = clean_company_name(cand['title']).lower().replace(" ", "")
    
    # 1. Name must match partially or completely
    if not (t_name in c_title or c_title in t_name):
        return False
        
    # 2. Address check: if snippet mentions address, must be Busan or target sigungu
    addr = cand.get('addr_snip', '')
    if addr and ("부산" in addr or target.get('sigungu', '') in addr):
        return True
    elif not addr: # No address in snippet -> worth checking
        return True
    elif "부산" not in addr and any(prov in addr for prov in ["서울", "경기", "인천", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]):
        # Non-busan address in snippet -> reject immediately!
        return False
        
    return True

def score_detail(target, cand):
    cand_addr = cand.get('addr', '')
    is_busan = "부산" in cand_addr
    
    t_addr = target.get('addr', '')
    t_sigungu = target.get('sigungu', '')
    
    # If not in Busan, reject
    if not is_busan and not ("부산" in t_addr or t_sigungu):
        return -100
        
    score = 0
    t_name = clean_company_name(target['name']).lower().replace(" ", "")
    c_name = clean_company_name(cand['title']).lower().replace(" ", "")
    
    if t_name == c_name:
        score += 50
    elif t_name in c_name or c_name in t_name:
        score += 30
    else:
        return 0
        
    if is_busan:
        score += 30
    else:
        return 0
        
    if t_sigungu and t_sigungu in cand_addr:
        score += 20
        
    # Tel match
    t_tel = re.sub(r'[^0-9]', '', target.get('tel', ''))
    c_tel = re.sub(r'[^0-9]', '', cand.get('tel', ''))
    if t_tel and c_tel and (t_tel == c_tel or t_tel.endswith(c_tel[-7:]) or c_tel.endswith(t_tel[-7:])):
        score += 40
        
    # CEO match
    t_ceo = target.get('ceo', '').strip()
    c_ceo = cand.get('ceo', '').strip()
    if t_ceo and c_ceo and (t_ceo == c_ceo or t_ceo in c_ceo or c_ceo in t_ceo):
        score += 35
        
    return score

def scan_target(t):
    c_name = clean_company_name(t['name'])
    
    # Try query
    queries = [f"{c_name} 부산", c_name]
    if t['name'] != c_name:
        queries.append(t['name'])
        
    candidates = []
    seen = set()
    for q in queries:
        items = parse_search_page(q)
        for it in items:
            if it["biz_no_10"] not in seen:
                seen.add(it["biz_no_10"])
                candidates.append(it)
        if candidates:
            break
            
    # Filter promising candidates
    promising = [c for c in candidates if candidate_looks_promising(t, c)]
    
    best_cand = None
    best_score = 0
    
    for c in promising[:3]:
        detail = get_bizno_detail(c['biz_no_10'])
        if not detail: continue
        s = score_detail(t, detail)
        if s > best_score:
            best_score = s
            best_cand = detail
        if s >= 80:
            break
            
    if best_cand and best_score >= 50:
        return {
            "row": t['row'],
            "name": t['name'],
            "status": "matched",
            "score": best_score,
            "biz_no": best_cand['biz_no'],
            "emp_cnt": best_cand['emp_cnt'], # ONLY from Bizno!
            "ceo": best_cand['ceo'] if best_cand['ceo'] else t.get('ceo', ''),
            "est_year": best_cand['est_year'] if best_cand['est_year'] else t.get('est_year', ''),
            "est_month": best_cand['est_month'] if best_cand['est_month'] else t.get('est_month', ''),
            "tel": best_cand['tel'] if best_cand['tel'] else t.get('tel', ''),
            "fax": best_cand['fax'] if best_cand['fax'] else t.get('fax', ''),
            "addr": best_cand['addr'] if best_cand['addr'] else t.get('addr', ''),
            "cand_status": best_cand['status'],
            "closed_date": best_cand['closed_date'],
            "source": "bizno"
        }
    else:
        return {
            "row": t['row'],
            "name": t['name'],
            "status": "unmatched_bizno",
            "score": best_score,
            "promising_checked": len(promising)
        }

def main():
    target_file = r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json"
    with open(target_file, "r", encoding="utf-8") as f:
        targets = json.load(f)
        
    out_file = r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\bizno_turbo_matches.json"
    progress = {}
    
    print(f"Starting turbo scan on {len(targets)} targets with 8 workers...")
    matched_count = 0
    completed = 0
    
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(scan_target, t): t for t in targets}
        for fut in as_completed(futures):
            t = futures[fut]
            try:
                res = fut.result()
                with progress_lock:
                    progress[str(res['row'])] = res
                    completed += 1
                    if res.get('status') == 'matched':
                        matched_count += 1
                        print(f"[{completed}/{len(targets)}] MATCHED: {res['name']} -> {res['biz_no']} (Emp: {res['emp_cnt']}, CEO: {res['ceo']})", flush=True)
                    else:
                        if completed % 10 == 0:
                            print(f"[{completed}/{len(targets)}] Processed... (Matched so far: {matched_count})", flush=True)
                            
                    if completed % 25 == 0 or completed == len(targets):
                        with open(out_file, "w", encoding="utf-8") as f:
                            json.dump(progress, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f"Error {t['name']}: {e}", flush=True)
                
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)
    print(f"\nALL FINISHED! Matched: {matched_count} / {len(targets)}", flush=True)

if __name__ == "__main__":
    main()
