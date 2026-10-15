import sys
import urllib.request
import re

sys.stdout.reconfigure(encoding='utf-8')
url = 'https://bizno.net/article/2908502480'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        m_title = re.search(r'<title>(.*?)</title>', html)
        print('Title:', m_title.group(1) if m_title else 'None')
        m_desc = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html)
        print('Desc:', m_desc.group(1) if m_desc else 'None')
except Exception as e:
    print('Error:', e)
