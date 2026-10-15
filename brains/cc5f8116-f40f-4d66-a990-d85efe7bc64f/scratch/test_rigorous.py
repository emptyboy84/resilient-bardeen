import json
import urllib.request
import urllib.parse
import re
import time

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

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
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except:
        return []
        
    posts = re.findall(r'<div class="single-post[\s\S]*?(?=<div class="single-post|<section|<footer>|$)', html)
    results = []
    seen = set()
    for p in posts:
        art_match = re.search(r'href=["\']/article/(\d{10})["\']', p)
        if not art_match:
            continue
        art_id = art_match.group(1)
        if art_id in seen:
            continue
        seen.add(art_id)
        clean_text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', p)).strip()
        results.append({
            "biz_no_10": art_id,
            "snippet": clean_text
        })
    return results

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

def test_rigorous(name, target_addr="", target_tel="", target_ceo=""):
    c_name = clean_company_name(name)
    queries = [f"{c_name} 부산", c_name]
    clean_tel = re.sub(r'[^0-9]', '', target_tel)
    if clean_tel and len(clean_tel) >= 7:
        queries.append(clean_tel)
        
    candidates = []
    seen = set()
    for q in queries:
        for item in parse_search_page(q):
            if item["biz_no_10"] not in seen:
                seen.add(item["biz_no_10"])
                candidates.append(item)
                
    # Filter candidates: MUST have Busan in snippet or address or target address keywords
    busan_cands = []
    for c in candidates:
        snip = c["snippet"]
        if "부산" in snip or any(kw in snip for kw in ["해운대", "센텀", "사상", "남구", "동래", "부산진", "금정", "기장", "수영", "연제", "동구", "서구", "영도", "사하", "강서", "중구", "북구"]):
            busan_cands.append(c)
            
    print(f"\nTarget: {name} (Addr: {target_addr}, Tel: {target_tel})")
    print(f"  Total cands: {len(candidates)}, Busan cands: {len(busan_cands)}")
    
    for bc in busan_cands[:3]:
        detail = get_bizno_detail(bc["biz_no_10"])
        if detail:
            print(f"   -> Found: {detail['title']} | {detail['biz_no']} | CEO: {detail['ceo']} | Emp: {detail['emp_cnt']} | Status: {detail['status']} | Addr: {detail['addr']}")
            time.sleep(0.3)

test_rigorous("모두싸인", "해운대구 재송동 1208-2 센텀스카이비즈")
test_rigorous("미라클링", "해운대구 재송1동 센텀스카이비즈")
test_rigorous("제이피테크", "해운대구 재송동 센텀스카이비즈")
test_rigorous("인우랩", "부산진구 가야1동 동의대학교산학협력관")
test_rigorous("도서출판일광", "기장군 차성로344번길", "051-723-0037")
