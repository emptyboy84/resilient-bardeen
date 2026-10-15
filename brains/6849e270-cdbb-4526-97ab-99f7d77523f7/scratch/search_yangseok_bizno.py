import urllib.request
import urllib.parse
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

queries = ["양석엔지니어링", "양무석", "6052724221"]

for q in queries:
    url = f"https://bizno.net/?query={urllib.parse.quote(q)}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            articles = re.findall(r'/article/(\d{10})', html)
            print(f"Query '{q}': found {len(articles)} articles -> {articles}")
            for a in articles:
                durl = f"https://bizno.net/article/{a}"
                dreq = urllib.request.Request(durl, headers=headers)
                with urllib.request.urlopen(dreq, timeout=2) as dresp:
                    dhtml = dresp.read().decode('utf-8', errors='ignore')
                    title = re.search(r'<title>(.*?)</title>', dhtml)
                    clean_d = ' '.join(re.sub(r'<[^>]+>', ' ', dhtml).split())
                    print(f"  [{a}] {title.group(1) if title else ''}")
                    # print addr
                    m_addr = re.search(r'회사주소\s*:\s*([^:]+?)(?:\s+우편번호|\s+홈페이지|\s+전화번호|$)', clean_d)
                    if m_addr:
                        print(f"    주소: {m_addr.group(1)}")
    except Exception as e:
        print(f"Error {q}: {e}")
