import json
import urllib.request
import urllib.parse
import re
import sys

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
            
    # Split by slash
    if "/" in clean:
        for p in clean.split("/"):
            if len(p.strip()) >= 2:
                variations.append(p.strip())
                
    # Add space-separated variations
    # e.g., "피커스튜디오" -> "피커 스튜디오"
    if "스튜디오" in clean and " 스튜디오" not in clean and not clean.startswith("스튜디오"):
        variations.append(clean.replace("스튜디오", " 스튜디오"))
    if "게임즈" in clean and " 게임즈" not in clean:
        variations.append(clean.replace("게임즈", " 게임즈"))
    if "엔터테인먼트" in clean and " 엔터테인먼트" not in clean:
        variations.append(clean.replace("엔터테인먼트", " 엔터테인먼트"))
    if "프로덕션" in clean and " 프로덕션" not in clean:
        variations.append(clean.replace("프로덕션", " 프로덕션"))
        
    return list(dict.fromkeys([v for v in variations if len(v) >= 2]))

def search_bizno(query):
    if not query or len(query.strip()) < 2: return []
    url = f"https://bizno.net/?query={urllib.parse.quote(query.strip())}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
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
        with urllib.request.urlopen(req, timeout=5) as resp:
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

def match_target(target):
    t_name = target['name']
    t_clean = clean_company_name(t_name).lower().replace(" ", "")
    t_tel = re.sub(r'[^0-9]', '', target.get('tel', ''))
    t_ceo = target.get('ceo', '').strip()
    t_addr = target.get('addr', '')
    t_sigungu = target.get('sigungu', '')
    
    variations = get_clean_variations(t_name)
    
    # Collect candidate articles
    cand_arts = []
    seen = set()
    
    # Try phone first
    if t_tel and len(t_tel) >= 7:
        for r in search_bizno(target.get('tel', '')):
            if r['biz_no_10'] not in seen:
                seen.add(r['biz_no_10'])
                cand_arts.append((r['biz_no_10'], "tel"))
                
    # Try name variations
    for v in variations:
        for r in search_bizno(v):
            if r['biz_no_10'] not in seen:
                seen.add(r['biz_no_10'])
                cand_arts.append((r['biz_no_10'], "name"))
        if len(cand_arts) >= 8:
            break
            
    # Evaluate candidates
    best_cand = None
    best_reason = None
    
    for art_id, src_type in cand_arts:
        d = get_bizno_detail(art_id)
        if not d: continue
        
        d_clean = clean_company_name(d['title']).lower().replace(" ", "")
        d_tel = re.sub(r'[^0-9]', '', d.get('tel', ''))
        d_ceo = d.get('ceo', '').strip()
        d_addr = d.get('addr', '')
        
        # Validation checks:
        
        # 1. Phone exact match
        if t_tel and d_tel and (t_tel == d_tel or (len(t_tel) >= 7 and len(d_tel) >= 7 and (t_tel.endswith(d_tel[-7:]) or d_tel.endswith(t_tel[-7:])))):
            # Phone match is extremely strong, but name should be somewhat related or address in Busan
            if "부산" in d_addr or t_clean in d_clean or d_clean in t_clean:
                best_cand = d
                best_reason = f"Phone match ({t_tel})"
                break
                
        # 2. Strict Name Match (Exact clean name)
        is_exact_name = (t_clean == d_clean)
        is_partial_name = (t_clean in d_clean or d_clean in t_clean) if len(t_clean) >= 3 and len(d_clean) >= 3 else False
        
        # CEO match
        is_ceo_match = (t_ceo and d_ceo and (t_ceo == d_ceo or t_ceo in d_ceo or d_ceo in t_ceo))
        
        # Location match
        is_busan = "부산" in d_addr
        is_sigungu = (t_sigungu and t_sigungu in d_addr) if t_sigungu else False
        
        # Criteria 1: Exact name AND CEO match
        if is_exact_name and is_ceo_match:
            best_cand = d
            best_reason = f"Exact name + CEO match ({t_ceo})"
            break
            
        # Criteria 2: Exact name AND Busan address
        if is_exact_name and is_busan:
            best_cand = d
            best_reason = f"Exact name + Busan address"
            break
            
        # Criteria 3: CEO match AND Busan address AND Partial name
        if is_ceo_match and is_busan and is_partial_name:
            best_cand = d
            best_reason = f"CEO match ({t_ceo}) + Busan + Partial name"
            break
            
        # Criteria 4: Partial name AND building match (센텀, 문화콘텐츠, etc.)
        for bld in ["센텀", "문화콘텐츠", "스카이비즈", "아이에스타워", "큐비이센텀", "클래스원", "피죤빌딩", "인텔리움센텀", "에이스하이테크"]:
            if bld in t_addr and bld in d_addr:
                best_cand = d
                best_reason = f"Building match ({bld}) + Partial name"
                break
        if best_cand: break

    return best_cand, best_reason

from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

progress_lock = threading.Lock()

if __name__ == "__main__":
    with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\unmatched_132_detail.json", "r", encoding="utf-8") as f:
        unmatched = json.load(f)
        
    print(f"Testing matching algorithm on {len(unmatched)} targets in parallel...")
    found_count = 0
    results = {}
    
    def process_one(u):
        cand, reason = match_target(u)
        return u, cand, reason
        
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(process_one, u): u for u in unmatched}
        for fut in as_completed(futures):
            try:
                u, cand, reason = fut.result()
                if cand:
                    with progress_lock:
                        found_count += 1
                        results[str(u['row'])] = {
                            "row": u['row'],
                            "name": u['name'],
                            "reason": reason,
                            "cand": cand
                        }
                        print(f"[{found_count:2d}] Row {u['row']:4d} | {u['name']} -> {cand['title']} ({cand['biz_no']}) | Emp: {cand['emp_cnt']} | CEO: {cand['ceo']} | Reason: {reason}", flush=True)
            except Exception as e:
                pass
            
    with open(r"C:\Users\lg\.gemini\antigravity\brain\cc5f8116-f40f-4d66-a990-d85efe7bc64f\scratch\v2_test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
        
    print(f"\nSimulation Done! Successfully matched: {found_count} / {len(unmatched)}", flush=True)
