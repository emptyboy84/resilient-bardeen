import urllib.request
import urllib.parse
import json
import re
from bs4 import BeautifulSoup
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
}

test_bnos = ['5131909625', '5132200420', '5138531350', '5138602624', '5140132973']

def fetch_bizno(bno, cname=''):
    url = f"https://bizno.net/article/{bno}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode('utf-8', errors='ignore')
            return html
    except Exception as e:
        # Search by query if direct article fails
        search_url = f"https://bizno.net/?query={urllib.parse.quote(bno)}"
        req_s = urllib.request.Request(search_url, headers=headers)
        try:
            with urllib.request.urlopen(req_s, timeout=5) as response:
                html = response.read().decode('utf-8', errors='ignore')
                return html
        except Exception as e2:
            return ""

def parse_bizno_html(html):
    soup = BeautifulSoup(html, 'html.parser')
    info = {}
    
    # Check tables
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        for r in rows:
            th = r.find(['th', 'td'])
            tds = r.find_all('td')
            if len(tds) >= 1:
                # Iterate th/td pairs
                row_text = r.get_text(" ", strip=True)
                for line in row_text.split('\n'):
                    pass
            # Or parse specific key value pairs
            th_tags = r.find_all('th')
            td_tags = r.find_all('td')
            for th_t, td_t in zip(th_tags, td_tags):
                k = th_t.get_text(strip=True)
                v = td_t.get_text(strip=True)
                info[k] = v
                
    # Also find text blocks
    return info

for b in test_bnos:
    html = fetch_bizno(b)
    data = parse_bizno_html(html)
    print(f"[{b}] Data keys: {list(data.keys())}")
    for k, v in data.items():
        if any(x in k for x in ['회사명', '상호', '대표자', '주소', '전화', '팩스', '업종', '법인', '인원', '홈페이지', '이메일']):
            print(f"  {k}: {v}")
    time.sleep(0.5)
