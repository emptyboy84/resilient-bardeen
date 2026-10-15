import openpyxl
import json
import re
import urllib.request
import urllib.parse
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

excel_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사_DB_배현명_1000행_정제_최종제출본.xlsx"
wb = openpyxl.load_workbook(excel_path, data_only=True)
ws = wb["실사DB_1000행_전수정제완료"]

empty_phone_targets = []

tax_office_numbers = [
    '051-740-9200', '051-310-6200', '051-580-6200', '051-620-9200',
    '051-240-0200', '051-810-6200', '051-559-6200', '051-460-6200',
    '051-780-6200', '126'
]

for r in range(2, ws.max_row + 1):
    name = str(ws.cell(r, 3).value or '').strip()
    biz_no = str(ws.cell(r, 4).value or '').strip()
    ceo = str(ws.cell(r, 5).value or '').strip()
    addr = str(ws.cell(r, 7).value or '').strip()
    phone = str(ws.cell(r, 8).value or '').strip()
    note = str(ws.cell(r, 2).value or '').strip()
    
    if '폐업' not in note and '휴업' not in note and not phone:
        empty_phone_targets.append({
            'row_idx': r,
            'name': name,
            'biz_no': biz_no,
            'ceo': ceo,
            'addr': addr
        })

print(f"Total active rows with empty phone to search: {len(empty_phone_targets)}")

def search_real_company_phone(t):
    row_idx = t['row_idx']
    name = t['name']
    ceo = t['ceo']
    addr = t['addr']
    
    clean_name = re.sub(r'\(주\)|주식회사|㈜|\(사\)|\(재\)|\(의\)', '', name).strip()
    
    # 1. Look up by clean_name + addr key or ceo
    addr_part = addr.split()[1] if len(addr.split()) > 1 else '부산'
    query = f"{clean_name} {addr_part}"
    
    found_phone = None
    
    # Try bizno specific text for company phone (not tax office)
    url = f"https://bizno.net/?query={urllib.parse.quote(clean_name)}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=3) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            articles = re.findall(r'/article/(\d{10})', html)
            if articles:
                det_url = f"https://bizno.net/article/{articles[0]}"
                dreq = urllib.request.Request(det_url, headers=headers)
                with urllib.request.urlopen(dreq, timeout=2) as dresp:
                    dhtml = dresp.read().decode('utf-8', errors='ignore')
                    
                    # Match exact table row for 전화번호
                    # In bizno, company phone is in: <th>전화번호</th><td>...</td>
                    m_table = re.search(r'전화번호</th>\s*<td[^>]*>\s*([0-9-]{8,14})', dhtml)
                    if m_table:
                        p_val = m_table.group(1).strip()
                        if p_val not in tax_office_numbers and not p_val.startswith('000-'):
                            found_phone = p_val
    except:
        pass
        
    return {
        'row_idx': row_idx,
        'name': name,
        'phone': found_phone
    }

print("Launching multi-worker phone search for genuine company numbers...")
start_time = time.time()

search_results = []
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(search_real_company_phone, t) for t in empty_phone_targets]
    for f in as_completed(futures):
        search_results.append(f.result())

print(f"Finished search in {time.time() - start_time:.2f}s!")
valid_found = [r for r in search_results if r['phone']]
print(f"Found legitimate company phone numbers for {len(valid_found)} companies!")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\company_phone_results.json', 'w', encoding='utf-8') as f:
    json.dump(valid_found, f, ensure_ascii=False, indent=2)

for vf in valid_found[:20]:
    print(f"Row {vf['row_idx']:4d}: {vf['name']:25s} -> {vf['phone']}")
