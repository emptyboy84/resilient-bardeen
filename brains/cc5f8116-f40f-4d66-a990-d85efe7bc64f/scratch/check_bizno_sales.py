import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Check articles for sales revenue
articles = ["1028111670", "7738601800", "1068186950", "3688701231", "5288800923"]

for art in articles:
    url = f"https://bizno.net/article/{art}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            m_title = re.search(r'<title>(.*?)</title>', html)
            title = m_title.group(1).replace('- 비즈노', '').strip() if m_title else art
            
            # search for 매출
            sales = re.findall(r'([^<>\n]{0,30}매출[^<>\n]{0,50})', html)
            print(f"\n--- {title} ({art}) ---")
            for s in sales[:5]:
                print(f"  {s.strip()}")
    except Exception as e:
        print(f"Error {art}: {e}")
