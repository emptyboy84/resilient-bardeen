import json
import urllib.request
import urllib.parse
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def search_bizno_exact(keyword):
    """Search bizno with clean keyword and return first few valid articles"""
    url = f"https://bizno.net/?query={urllib.parse.quote(keyword.strip())}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
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

# Test target cases
test_targets = [
    ("피커스튜디오", ["피커스튜디오", "피커 스튜디오"]),
    ("유티플러스인터랙티브", ["유티플러스인터랙티브", "유티플러스"]),
    ("시드게임즈", ["시드게임즈", "시드 게임즈"]),
    ("와이즈온미디어 주식회사", ["와이즈온미디어"]),
    ("주식회사 도원이앤아이(Dowon E&I)", ["도원이앤아이", "도원 이앤아이"]),
    ("헤윰아이씨티", ["헤윰아이씨티", "헤윰"]),
    ("스튜디오비오", ["스튜디오비오", "스튜디오 비오"]),
    ("하드롤게임즈", ["하드롤게임즈", "하드롤"]),
    ("운도게임스튜디오", ["운도게임스튜디오", "운도"]),
    ("한국가이던스부산지사", ["한국가이던스"]),
    ("케이엘정보통신 주식회사 부산지점", ["케이엘정보통신"]),
    ("영풍문고 신세계 센텀시티점", ["영풍문고 센텀", "영풍문고 신세계"]),
    ("（주교보문고부산점", ["교보문고 부산", "교보문고"]),
    ("반다이남코코리아", ["반다이남코코리아", "반다이남코"]),
]

for name, q_list in test_targets:
    print(f"\n--- Testing target: {name} ---")
    found = False
    for q in q_list:
        results = search_bizno_exact(q)
        for r in results:
            d = get_bizno_detail(r['biz_no_10'])
            if d:
                print(f"   Candidate: {d['title']} | Biz: {d['biz_no']} | CEO: {d['ceo']} | Emp: {d['emp_cnt']} | Addr: {d['addr'][:35]} | Status: {d['status']}")
                found = True
        if found:
            break
    if not found:
        print("   No candidate found on bizno.")
