import urllib.request
import urllib.parse
import json
import re
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
}

def clean_html(text):
    text = re.sub(r'<script.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<style.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'&nbsp;', ' ', text)
    text = re.sub(r'&amp;', '&', text)
    text = re.sub(r'&lt;', '<', text)
    text = re.sub(r'&gt;', '>', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def fetch_bizno(bno):
    # Try article URL
    url = f"https://bizno.net/article/{bno}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        # Search URL
        search_url = f"https://bizno.net/?query={urllib.parse.quote(bno)}"
        req_s = urllib.request.Request(search_url, headers=headers)
        try:
            with urllib.request.urlopen(req_s, timeout=5) as response:
                return response.read().decode('utf-8', errors='ignore')
        except Exception:
            return ""

def parse_bizno_details(html):
    if not html:
        return {}
    
    details = {}
    
    # Check table rows like <th>Key</th><td>Value</td>
    tr_matches = re.findall(r'<tr[^>]*>(.*?)</tr>', html, flags=re.DOTALL | re.IGNORECASE)
    for tr in tr_matches:
        th_match = re.search(r'<th[^>]*>(.*?)</th>', tr, flags=re.DOTALL | re.IGNORECASE)
        td_match = re.search(r'<td[^>]*>(.*?)</td>', tr, flags=re.DOTALL | re.IGNORECASE)
        if th_match and td_match:
            k = clean_html(th_match.group(1))
            v = clean_html(td_match.group(1))
            if k and v:
                details[k] = v
                
    # Also look for dl/dt/dd or generic patterns
    dt_matches = re.findall(r'<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>', html, flags=re.DOTALL | re.IGNORECASE)
    for dt, dd in dt_matches:
        k = clean_html(dt)
        v = clean_html(dd)
        if k and v:
            details[k] = v
            
    return details

test_bnos = ['5131909625', '5132200420', '5138531350', '5138602624', '5140132973']

for b in test_bnos:
    html = fetch_bizno(b)
    data = parse_bizno_details(html)
    print(f"\n==================== [{b}] ====================")
    if data:
        for k, v in data.items():
            print(f"  {k} : {v}")
    else:
        print("  No table data found, raw cleaned snippet:")
        print(" ", clean_html(html)[:300])
    time.sleep(0.5)
