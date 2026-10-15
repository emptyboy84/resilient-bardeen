import re

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\yangseok_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find all table rows <tr><th>...</th><td>...</td></tr>
rows = re.findall(r'<tr[^>]*>\s*<th[^>]*>(.*?)</th>\s*<td[^>]*>(.*?)</td>\s*</tr>', html, re.DOTALL)
for th, td in rows:
    th_c = ' '.join(re.sub(r'<[^>]+>', '', th).split())
    td_c = ' '.join(re.sub(r'<[^>]+>', '', td).split())
    print(f"[{th_c}] : {td_c}")
