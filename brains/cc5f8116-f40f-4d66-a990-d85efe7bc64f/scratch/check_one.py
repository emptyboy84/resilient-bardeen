import sys
import urllib.request
import re

sys.stdout.reconfigure(encoding='utf-8')

art_id = sys.argv[1].replace("-", "")
url = f"https://bizno.net/article/{art_id}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        m_title = re.search(r'<title>(.*?)</title>', html)
        print('Title:', m_title.group(1).replace('- 비즈노', '').strip() if m_title else 'No title')
        m_desc = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html)
        print('Desc:', m_desc.group(1) if m_desc else 'No desc')
        
        emp_match = re.search(r'종업원수\s*:\s*(\d+)명', html) or (re.search(r'종업원수\s*:\s*(\d+)명', m_desc.group(1)) if m_desc else None)
        print('Emp:', emp_match.group(1) if emp_match else 'None')
        
        closed_match = re.search(r'폐업일자\s*:\s*(\d{4}-\d{2}-\d{2})', html)
        print('Closed:', closed_match.group(1) if closed_match else 'None')
except Exception as e:
    print('Error:', e)
