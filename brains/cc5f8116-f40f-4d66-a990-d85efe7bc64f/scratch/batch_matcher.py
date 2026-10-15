import json
import urllib.request
import urllib.parse
import re
import time
import os

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def clean_company_name(name):
    clean = re.sub(r'\(주\)|주식회사|\(유\)|\(사\)|\(재\)|\(합\)|\(주식회사\)', '', name).strip()
    return clean

def search_bizno_query(query):
    if not query or len(query.strip()) < 2:
        return []
    url = f"https://bizno.net/?query={urllib.parse.quote(query.strip())}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract unique article IDs
            links = re.findall(r'/article/(\d{10})', html)
            # preserve order, unique
            seen = set()
            res = []
            for l in links:
                if l not in seen:
                    seen.add(l)
                    res.append(l)
            return res
    except Exception as e:
        return []

def get_bizno_detail(biz_no_10):
    url = f"https://bizno.net/article/{biz_no_10}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
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
            
            # 종업원수 (종사자수)
            emp_match = re.search(r'종업원수\s*:\s*(\d+)명', desc)
            emp_cnt = int(emp_match.group(1)) if emp_match else ""
            
            # 사업자등록번호
            biz_match = re.search(r'사업자등록번호\s*:\s*(\d{3}-\d{2}-\d{5})', desc)
            biz_no = biz_match.group(1) if biz_match else f"{biz_no_10[:3]}-{biz_no_10[3:5]}-{biz_no_10[5:]}"
            
            # 전화번호
            tel_match = re.search(r'전화번호\s*:\s*([0-9\-]+)', desc)
            tel = tel_match.group(1).strip() if tel_match else ""
            
            # 팩스번호
            fax_match = re.search(r'팩스번호\s*:\s*([0-9\-]+)', desc)
            fax = fax_match.group(1).strip() if fax_match else ""
            
            # 주소
            addr_match = re.search(r'회사주소\s*:\s*(.*?)(?=\s+(?:종업원수|사업자등록번호|법인등록번호|홈페이지|통신판매업번호|$))', desc)
            if not addr_match:
                addr_match = re.search(r'소재지\s*</th>\s*<td[^>]*>(.*?)</td>', html)
            addr = addr_match.group(1).strip() if addr_match else ""
            addr = re.sub(r'<[^>]+>', ' ', addr).strip()
            
            # 상태
            status_match = re.search(r'사업자 현재 상태[^\:]*:\s*([^\s<]+)', desc)
            status = status_match.group(1) if status_match else ""
            
            # 폐업일자
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
    except Exception as e:
        return None

def score_match(target, cand):
    # Evaluate if candidate matches target
    score = 0
    t_name = clean_company_name(target['name']).lower()
    c_name = clean_company_name(cand['title']).lower()
    
    # Check Busan region
    is_busan = "부산" in cand.get('addr', '') or cand['biz_no_10'].startswith(('602', '603', '604', '605', '606', '607', '608', '609', '617', '618', '243', '421', '182'))
    
    # 1. Exact name match
    if t_name == c_name:
        score += 40
    elif t_name in c_name or c_name in t_name:
        score += 20
        
    # 2. Busan match
    if is_busan:
        score += 25
    else:
        # Non-busan penalty
        score -= 50
        
    # 3. Sigungu match
    t_sigungu = target.get('sigungu', '')
    if t_sigungu and t_sigungu in cand.get('addr', ''):
        score += 20
        
    # 4. Tel match
    t_tel = re.sub(r'[^0-9]', '', target.get('tel', ''))
    c_tel = re.sub(r'[^0-9]', '', cand.get('tel', ''))
    if t_tel and c_tel and (t_tel == c_tel or t_tel.endswith(c_tel) or c_tel.endswith(t_tel)):
        score += 35
        
    # 5. CEO match
    t_ceo = target.get('ceo', '').strip()
    c_ceo = cand.get('ceo', '').strip()
    if t_ceo and c_ceo and (t_ceo == c_ceo or t_ceo in c_ceo or c_ceo in t_ceo):
        score += 30
        
    return score

def process_target_batch(start_idx, end_idx):
    target_file = r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\target_318_companies.json"
    with open(target_file, "r", encoding="utf-8") as f:
        targets = json.load(f)
        
    progress_file = r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\matching_progress.json"
    progress = {}
    if os.path.exists(progress_file):
        try:
            with open(progress_file, "r", encoding="utf-8") as f:
                progress = json.load(f)
        except:
            progress = {}
            
    batch = targets[start_idx:end_idx]
    print(f"Processing batch: index {start_idx} to {end_idx} (Count: {len(batch)})")
    
    for i, t in enumerate(batch):
        row_key = str(t['row'])
        if row_key in progress and progress[row_key].get('status') == 'matched':
            continue
            
        print(f"[{start_idx + i + 1}/{len(targets)}] Checking Row {t['row']}: {t['name']} | Tel: {t['tel']} | Addr: {t['addr']}")
        
        # Search candidate IDs
        candidate_ids = []
        # 1. Clean name
        c_name = clean_company_name(t['name'])
        if c_name:
            candidate_ids.extend(search_bizno_query(c_name))
        # 2. Original name if different
        if t['name'] != c_name:
            for cid in search_bizno_query(t['name']):
                if cid not in candidate_ids: candidate_ids.append(cid)
        # 3. Clean tel if exists
        clean_tel = re.sub(r'[^0-9]', '', t.get('tel', ''))
        if clean_tel and len(clean_tel) >= 7:
            for cid in search_bizno_query(clean_tel):
                if cid not in candidate_ids: candidate_ids.append(cid)
                
        # Now score top candidates (check up to first 5)
        best_cand = None
        best_score = 0
        
        for cid in candidate_ids[:6]:
            cand = get_bizno_detail(cid)
            if not cand:
                continue
            s = score_match(t, cand)
            if s > best_score:
                best_score = s
                best_cand = cand
            time.sleep(0.3)
            
        if best_cand and best_score >= 50:
            print(f"  --> MATCHED (score={best_score}): {best_cand['title']} ({best_cand['biz_no']}), Emp: {best_cand['emp_cnt']}, CEO: {best_cand['ceo']}, Status: {best_cand['status']}")
            progress[row_key] = {
                "row": t['row'],
                "name": t['name'],
                "status": "matched",
                "score": best_score,
                "biz_no": best_cand['biz_no'],
                "emp_cnt": best_cand['emp_cnt'], # Fixed from Bizno
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
            print(f"  --> NO BIZNO MATCH (best_score={best_score}, cands={len(candidate_ids)})")
            progress[row_key] = {
                "row": t['row'],
                "name": t['name'],
                "status": "unmatched_bizno",
                "score": best_score,
                "candidate_count": len(candidate_ids)
            }
            
        # Save every item
        with open(progress_file, "w", encoding="utf-8") as f:
            json.dump(progress, f, ensure_ascii=False, indent=2)
            
        time.sleep(0.5)

if __name__ == "__main__":
    import sys
    s = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    e = int(sys.argv[2]) if len(sys.argv) > 2 else 50
    process_target_batch(s, e)
