import urllib.request
import urllib.parse
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

candidates = ['6031372550', '6078614707', '6828703270', '6063739691', '6210984396']

for c in candidates:
    url = f"https://bizno.net/article/{c}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract company name, CEO, address, status, business type
            title = re.search(r'<title>(.*?)</title>', html)
            table_text = re.sub(r'<[^>]+>', ' ', html)
            clean_text = ' '.join(table_text.split())
            print(f"=== {c} ===")
            print("Title:", title.group(1) if title else '')
            # find key fields
            for key in ['대표자', '상태', '주소', '업종', '법인등록번호']:
                m = re.search(rf'{key}\s*([^\s]+(?:\s+[^\s]+){{0,5}})', clean_text)
                if m:
                    print(f"  {key}: {m.group(0)}")
            print("-" * 50)
    except Exception as e:
        print(f"Error {c}: {e}")
