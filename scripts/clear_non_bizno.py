import csv
import json
import sys
import re
import ssl
import subprocess
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.stdout.reconfigure(encoding='utf-8')

ORIGINAL_BACKUP = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_backup_20260820.csv"
CSV_PATH = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.csv"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

MX_CACHE = {}

def check_mx_record(domain):
    domain = domain.strip().lower()
    if not domain:
        return False
    if domain in MX_CACHE:
        return MX_CACHE[domain]
    try:
        res = subprocess.run(['nslookup', '-type=mx', domain], capture_output=True, text=True, timeout=4)
        out = res.stdout.lower()
        has_mx = ('mail exchanger' in out or 'mx' in out) and ('server:' in out)
        MX_CACHE[domain] = has_mx
        return has_mx
    except Exception:
        MX_CACHE[domain] = False
        return False

def clean_phone_or_fax(val):
    if not val:
        return ""
    val = re.sub(r'<[^>]+>', '', val)
    val = val.replace('&nbsp;', ' ')
    val = re.sub(r'\(※.*?\)', '', val).strip()
    if '*' in val or val in ['-', '.', '없음']:
        return ""
    if re.search(r'000-0000|0000-0000', val):
        return ""
    clean = re.sub(r'[^0-9-]', '', val).strip('-')
    if len(re.sub(r'[^0-9]', '', clean)) < 7:
        return ""
    return clean

def validate_email(email_str):
    if not email_str:
        return ""
    email_str = re.sub(r'<[^>]+>', '', email_str)
    email_str = email_str.replace('&nbsp;', '').strip()
    email_str = re.sub(r'[\s\t\r\n]+', '', email_str)
    match = re.match(r'^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)$', email_str)
    if not match:
        return ""
    domain = match.group(1).lower()
    if check_mx_record(domain):
        return email_str
    return ""

def validate_homepage(url_str):
    if not url_str:
        return ""
    url_str = re.sub(r'<[^>]+>', '', url_str)
    url_str = url_str.replace('&nbsp;', '').strip()
    url_str = re.sub(r'[\s\t\r\n]+', '', url_str)
    if not url_str or url_str in ['-', '.', '없음', 'http://', 'https://']:
        return ""
    if url_str.rstrip('/') in ['https://smartstore.naver.com', 'http://smartstore.naver.com',
                               'https://sell.smartstore.naver.com', 'http://sell.smartstore.naver.com']:
        return ""
    if not url_str.startswith('http://') and not url_str.startswith('https://'):
        urls_to_try = [f"https://{url_str}", f"http://{url_str}"]
    else:
        urls_to_try = [url_str]
        
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for target_url in urls_to_try:
        try:
            req = urllib.request.Request(target_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=4, context=ctx) as resp:
                code = resp.getcode()
                if 200 <= code < 400:
                    return target_url
        except Exception:
            continue
    return ""

def fetch_bizno_data(biz_no, company_name):
    clean_biz = re.sub(r'[^0-9]', '', str(biz_no)) if biz_no else ''
    url = f"https://bizno.net/article/{clean_biz}" if clean_biz else None
    
    data = {'전화번호': '', '팩스번호': '', '홈페이지': '', '이메일': '', '상태': ''}
    html = ""
    if url:
        for _ in range(2):
            try:
                req = urllib.request.Request(url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=6) as resp:
                    html = resp.read().decode('utf-8', errors='replace')
                    break
            except Exception:
                time.sleep(0.5)
            
    if not html or "해당 정보를 찾을 수 없습니다" in html or "존재하지 않는" in html or len(html) < 500:
        if company_name and company_name.strip():
            clean_cname = re.sub(r'[\(\)\[\]\㈜\주식회사]', ' ', company_name).strip()
            if not clean_cname:
                clean_cname = company_name.strip()
            q_url = f"https://bizno.net/?query={urllib.parse.quote(clean_cname)}"
            try:
                req = urllib.request.Request(q_url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=6) as resp:
                    q_html = resp.read().decode('utf-8', errors='replace')
                    links = re.findall(r'href="(/article/[0-9]+)"', q_html)
                    if links:
                        target_url = f"https://bizno.net{links[0]}"
                        req2 = urllib.request.Request(target_url, headers=HEADERS)
                        with urllib.request.urlopen(req2, timeout=6) as resp2:
                            html = resp2.read().decode('utf-8', errors='replace')
            except Exception:
                pass
                
    if html:
        rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        for r in rows:
            th = re.findall(r'<th[^>]*>(.*?)</th>', r, re.DOTALL)
            td = re.findall(r'<td[^>]*>(.*?)</td>', r, re.DOTALL)
            th_clean = [re.sub(r'<[^>]+>', '', t).strip() for t in th]
            td_clean = [re.sub(r'<[^>]+>', '', t).strip() for t in td]
            if th_clean and td_clean:
                k = th_clean[0]
                v = td_clean[0]
                if 'adsbygoogle' in v:
                    continue
                if '전화번호' in k and not data['전화번호']:
                    data['전화번호'] = v
                elif '팩스번호' in k and not data['팩스번호']:
                    data['팩스번호'] = v
                elif '홈페이지' in k and not data['홈페이지']:
                    data['홈페이지'] = v
                elif ('회사이메일' in k or '이메일' in k) and not data['이메일']:
                    data['이메일'] = v
                elif '사업자 현재 상태' in k and not data['상태']:
                    data['상태'] = v.split()[0] if v else ''
                    
    return data

def process_clear_non_bizno(item):
    r_idx, actual_rn, row = item
    cname = row[2].strip() if len(row) > 2 else ''
    bizno = row[3].strip() if len(row) > 3 else ''
    
    old_phone = row[7].strip() if len(row) > 7 else ''
    old_fax = row[8].strip() if len(row) > 8 else ''
    old_hp = row[9].strip() if len(row) > 9 else ''
    old_email = row[10].strip() if len(row) > 10 else ''
    
    biz_data = fetch_bizno_data(bizno, cname)
    
    # Strictly what Bizno has
    biz_phone = clean_phone_or_fax(biz_data['전화번호'])
    biz_fax = clean_phone_or_fax(biz_data['팩스번호'])
    biz_hp = validate_homepage(biz_data['홈페이지'])
    biz_email = validate_email(biz_data['이메일'])
    
    # Check what will be cleared (where old was non-empty, but bizno has none)
    cleared = []
    if old_phone and not biz_phone:
        cleared.append(('전화번호', old_phone))
    if old_fax and not biz_fax:
        cleared.append(('팩스번호', old_fax))
    if old_hp and not biz_hp:
        cleared.append(('홈페이지', old_hp))
    if old_email and not biz_email:
        cleared.append(('이메일', old_email))
        
    kept_or_updated = []
    if biz_phone: kept_or_updated.append(('전화번호', old_phone, biz_phone))
    if biz_fax: kept_or_updated.append(('팩스번호', old_fax, biz_fax))
    if biz_hp: kept_or_updated.append(('홈페이지', old_hp, biz_hp))
    if biz_email: kept_or_updated.append(('이메일', old_email, biz_email))

    return {
        'r_idx': r_idx,
        'actual_rn': actual_rn,
        'company': cname,
        'bizno': bizno,
        'new_phone': biz_phone,
        'new_fax': biz_fax,
        'new_hp': biz_hp,
        'new_email': biz_email,
        'cleared': cleared,
        'kept_or_updated': kept_or_updated
    }

def main():
    print("Reading CSV...")
    with open(CSV_PATH, "r", encoding="utf-8-sig", errors="replace") as f:
        reader = list(csv.reader(f))
        
    target_items = []
    for r_idx in range(1, len(reader)):
        row = reader[r_idx]
        actual_rn = r_idx + 1
        if actual_rn >= 5038 and len(row) > 0 and row[0].strip() == "배현명":
            target_items.append((r_idx, actual_rn, row))
            
    print(f"Target items: {len(target_items)}")
    
    results = []
    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(process_clear_non_bizno, item): item for item in target_items}
        for future in as_completed(futures):
            results.append(future.result())
            if len(results) % 50 == 0 or len(results) == len(target_items):
                print(f"[{len(results)}/{len(target_items)}] Processed")
                
    results.sort(key=lambda x: x['actual_rn'])
    
    total_cleared_count = sum(len(r['cleared']) for r in results)
    total_kept_count = sum(len(r['kept_or_updated']) for r in results)
    
    print(f"\nTotal fields to clear (not on Bizno): {total_cleared_count}")
    print(f"Total fields on Bizno: {total_kept_count}")
    
    # Count by field
    cleared_by_field = {}
    for r in results:
        for f_name, old_v in r['cleared']:
            cleared_by_field[f_name] = cleared_by_field.get(f_name, 0) + 1
            
    print("Cleared fields breakdown:")
    for f_name, cnt in cleared_by_field.items():
        print(f" - {f_name}: {cnt}건 삭제(공란 처리)")
        
    # Apply to reader
    for r in results:
        r_idx = r['r_idx']
        row = reader[r_idx]
        while len(row) <= 10:
            row.append('')
        row[7] = r['new_phone']
        row[8] = r['new_fax']
        row[9] = r['new_hp']
        row[10] = r['new_email']
        
    # Save back to CSV
    print(f"Writing updated CSV to {CSV_PATH}...")
    with open(CSV_PATH, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(reader)
    print("CSV updated successfully!")
    
    # Save result log
    with open(r"C:\Users\lg\.gemini\antigravity\brain\ceeeb9d0-a329-465f-959f-4f7ef640a0c0\scratch\clear_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    main()
