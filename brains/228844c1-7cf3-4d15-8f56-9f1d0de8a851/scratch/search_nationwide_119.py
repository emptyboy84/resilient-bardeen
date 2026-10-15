import json
import urllib.request
import urllib.parse
import re
import time

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/unresolved_119.json', encoding='utf-8') as f:
    unresolved = json.load(f)

print(f"Loaded {len(unresolved)} rows.")

def clean_title(s):
    return re.sub(r'<[^>]+>', '', s).strip()

def search_bizno_nationwide(query):
    url = f"https://bizno.net/?query={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            if "0개의 결과를 찾았습니다" in html or "검색결과가 없습니다" in html:
                return []
            matches = re.findall(r'<a[^>]+href="(/article/(\d{10}))"[^>]*>(.*?)</a>', html, re.DOTALL)
            results = []
            for href, bno, inner in matches:
                title = clean_title(inner)
                if title and not any(k in title for k in ["실시간", "인기검색어"]):
                    results.append({"bno": bno, "title": title})
            return results
    except Exception:
        return []

def get_detail(bno):
    url = f"https://bizno.net/article/{bno}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            lines = [clean_title(l) for l in html.splitlines() if clean_title(l)]
            text = " ".join(lines)
            info = {"bno": bno}
            if "폐업자" in text:
                info["status"] = "폐업자"
                m_close = re.search(r'폐업일자[:\s]*(\d{4}[-.]\d{2}[-.]\d{2})', text)
                if not m_close:
                    m_close = re.search(r'(\d{4}-\d{2}-\d{2})\s*폐업', text)
                if m_close:
                    info["close_date"] = m_close.group(1)
            elif "계속사업자" in text:
                info["status"] = "계속사업자"
                
            m_rep = re.search(r'대표자명?[:\s]*([^\s,]+)', text)
            if m_rep:
                info["rep"] = m_rep.group(1)
            m_est = re.search(r'개업일자[:\s]*(\d{4}[-.]\d{2}[-.]\d{2})', text)
            if not m_est:
                m_est = re.search(r'설립일자[:\s]*(\d{4}[-.]\d{2}[-.]\d{2})', text)
            if m_est:
                info["est_date"] = m_est.group(1)
            return info
    except:
        return {}

additional_found = {}

# Target candidates
for u in unresolved:
    name = u['name']
    q = re.sub(r'[\s\(\)주식회사㈜\[\]\-_,./]', '', name)
    # filter out known comic rooms and local delivery depots
    if any(k in q for k in ["만화", "지국", "보급소", "신문센타", "센터", "배달"]):
        continue
    if len(q) < 2:
        continue
        
    res = search_bizno_nationwide(q)
    if res:
        # check if rep matches or name exact
        for r in res[:3]:
            rt = re.sub(r'[\s\(\)주식회사㈜\[\]\-_,./]', '', r['title'])
            if q == rt or (len(q) >= 4 and q in rt):
                d = get_detail(r['bno'])
                # check rep
                if u['rep'] and d.get('rep') and u['rep'] == d.get('rep'):
                    additional_found[u['row_idx']] = {"cand": r, "detail": d, "target": u, "reason": "rep_match"}
                    print(f"FOUND EXACT REP: Row {u['row_idx']} {name} ({u['rep']}) -> {r['title']} ({d['rep']}) BNO: {r['bno']}")
                    break
                elif q == rt:
                    additional_found[u['row_idx']] = {"cand": r, "detail": d, "target": u, "reason": "exact_name"}
                    print(f"FOUND EXACT NAME: Row {u['row_idx']} {name} -> {r['title']} BNO: {r['bno']}")
                    break
    time.sleep(0.2)

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/additional_119_found.json', 'w', encoding='utf-8') as f:
    json.dump(additional_found, f, ensure_ascii=False, indent=2)

print(f"Additional found: {len(additional_found)}")
