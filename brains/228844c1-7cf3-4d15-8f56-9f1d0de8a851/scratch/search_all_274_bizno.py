import json
import urllib.request
import urllib.parse
import re
import time

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/real_unmatched_274.json', encoding='utf-8') as f:
    targets = json.load(f)

print(f"Loaded {len(targets)} targets for Bizno search.")

# Clean helper
def clean_title(s):
    return re.sub(r'<[^>]+>', '', s).strip()

def search_bizno(query, area="부산"):
    url = f"https://bizno.net/?area={urllib.parse.quote(area)}&query={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    try:
        with urllib.request.urlopen(req, timeout=7) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            if "0개의 결과를 찾았습니다" in html or "검색결과가 없습니다" in html:
                return []
            
            # Look for article links inside main list
            # Bizno search items: <a href="/article/XXXXXXXXXX"> ... <h4 ...>COMPANY</h4> ...
            # We must only take links inside the search result container, not the sidebar
            matches = re.findall(r'<a[^>]+href="(/article/(\d{10}))"[^>]*>(.*?)</a>', html, re.DOTALL)
            results = []
            for href, bno, inner in matches:
                # filter out sidebar
                title = clean_title(inner)
                if title and not any(k in title for k in ["실시간", "인기검색어", "조회수"]):
                    results.append({"bno": bno, "title": title, "href": href})
            return results
    except Exception as e:
        return []

def get_bizno_detail(bno):
    url = f"https://bizno.net/article/{bno}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    try:
        with urllib.request.urlopen(req, timeout=7) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # parse table
            # key info: 상호, 대표자, 등록번호, 상태, 폐업일자, 설립일자, 주소
            lines = [clean_title(l) for l in html.splitlines() if clean_title(l)]
            info = {"bno": bno, "raw_html": True}
            text = " ".join(lines)
            
            # Status
            if "폐업자" in text:
                info["status"] = "폐업자"
                m_close = re.search(r'폐업일자[:\s]*(\d{4}[-.]\d{2}[-.]\d{2})', text)
                if not m_close:
                    m_close = re.search(r'(\d{4}-\d{2}-\d{2})\s*폐업', text)
                if m_close:
                    info["close_date"] = m_close.group(1)
            elif "계속사업자" in text:
                info["status"] = "계속사업자"
                
            # Rep
            m_rep = re.search(r'대표자명?[:\s]*([^\s,]+)', text)
            if m_rep:
                info["rep"] = m_rep.group(1)
                
            # Est date
            m_est = re.search(r'개업일자[:\s]*(\d{4}[-.]\d{2}[-.]\d{2})', text)
            if not m_est:
                m_est = re.search(r'설립일자[:\s]*(\d{4}[-.]\d{2}[-.]\d{2})', text)
            if m_est:
                info["est_date"] = m_est.group(1)
                
            # Addr
            m_addr = re.search(r'사업장주소[:\s]*([^<]+?)(?=홈페이지|전화번호|업종|팩스|사업장|$)', text)
            if m_addr:
                info["addr"] = m_addr.group(1).strip()
                
            return info
    except Exception as e:
        return {}

all_results = []

# Process in batches with progress saving
start_time = time.time()
for idx, target in enumerate(targets):
    row_idx = target["row_idx"]
    name = target["name"]
    phone = target["phone"]
    rep = target["rep"]
    addr = target["addr"]
    
    # 1. Simplify name for search
    clean_q = re.sub(r'[\s\(\)주식회사㈜\[\]\-_,./]', '', name)
    
    candidates = []
    # Search by clean name
    cand = search_bizno(clean_q, area="부산")
    if not cand and len(clean_q) > 4:
        # try without common suffixes
        cand = search_bizno(clean_q[:4], area="부산")
        
    # Search by phone if exists and no cand
    if not cand and phone:
        cand = search_bizno(phone, area="")
        
    matched_candidate = None
    if cand:
        # find best candidate matching name, rep, or addr
        for c in cand:
            c_title = re.sub(r'[\s\(\)주식회사㈜]', '', c["title"])
            if clean_q in c_title or c_title in clean_q:
                matched_candidate = c
                break
        if not matched_candidate and len(cand) == 1:
            matched_candidate = cand[0]
            
    detail = {}
    if matched_candidate:
        detail = get_bizno_detail(matched_candidate["bno"])
        time.sleep(0.3)
        
    all_results.append({
        "target": target,
        "matched": matched_candidate,
        "detail": detail
    })
    
    if (idx + 1) % 25 == 0 or (idx + 1) == len(targets):
        print(f"Progress: [{idx+1}/{len(targets)}] ({time.time()-start_time:.1f}s) - {name} -> {matched_candidate['bno'] if matched_candidate else 'None'}")
        with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_274_results.json', 'w', encoding='utf-8') as f:
            json.dump(all_results, f, ensure_ascii=False, indent=2)

print("All 274 Bizno searches completed!")
