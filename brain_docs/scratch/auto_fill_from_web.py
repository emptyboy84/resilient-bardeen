import sys
import re
import urllib.request
import urllib.parse
import json
import socket
import concurrent.futures
import openpyxl
from openpyxl.styles import PatternFill

sys.stdout.reconfigure(encoding='utf-8')

f_out = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_검증완료.xlsx'

yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid")

def check_url(url):
    if not url or str(url).strip() in ['-', '', 'None']:
        return None, False
    url_str = str(url).strip()
    target_url = url_str if url_str.startswith('http://') or url_str.startswith('https://') else 'http://' + url_str
    try:
        req = urllib.request.Request(target_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status in [200, 301, 302]:
                return target_url, True
    except Exception:
        pass
    return url_str, False

def check_email(email):
    if not email or str(email).strip() in ['-', '', 'None']:
        return None, False
    email_str = str(email).strip()
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email_str):
        return email_str, False
    domain = email_str.split('@')[-1]
    try:
        socket.gethostbyname(domain)
        return email_str, True
    except Exception:
        return email_str, False

def fetch_info(biz_no, comp_name):
    clean_biz = re.sub(r'[^0-9]', '', str(biz_no)) if biz_no else ''
    info = {'대표자': None, '전화번호': None, '팩스번호': None, '홈페이지': None, '이메일': None}
    
    if not clean_biz and not comp_name:
        return info
        
    # 1. 비즈노 조회 시도
    if clean_biz:
        try:
            url = f"https://bizno.net/article/{clean_biz}"
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=3) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                
                rep_m = re.search(r'대표자[^\w\n]*</th>[^\w\n]*<td>([^<]+)</td>', html)
                if rep_m: info['대표자'] = rep_m.group(1).strip()
                
                phone_m = re.search(r'전화번호[^\w\n]*</th>[^\w\n]*<td>([^<]+)</td>', html)
                if phone_m: info['전화번호'] = phone_m.group(1).strip()
                
                fax_m = re.search(r'팩스번호[^\w\n]*</th>[^\w\n]*<td>([^<]+)</td>', html)
                if fax_m: info['팩스번호'] = fax_m.group(1).strip()
                
                hp_m = re.search(r'홈페이지[^\w\n]*</th>[^\w\n]*<td><a[^>]*href=["\']([^"\']+)["\']', html)
                if hp_m: info['홈페이지'] = hp_m.group(1).strip()
                
                email_m = re.search(r'이메일[^\w\n]*</th>[^\w\n]*<td>([^<]+)</td>', html)
                if email_m: info['이메일'] = email_m.group(1).strip()
        except Exception:
            pass
            
    return info

print("1. 파일 읽는 중...")
wb = openpyxl.load_workbook(f_out)
s = wb['기업 정보']

max_c = 60
headers = [str(cell.value).strip() if cell.value is not None else "" for cell in list(s.iter_rows(min_row=1, max_row=1, max_col=max_c))[0]]

col_map = {name: idx+1 for idx, name in enumerate(headers)}

biz_c = col_map.get('사업자번호')
comp_c = col_map.get('회사명')
rep_c = col_map.get('대표자')
phone_c = col_map.get('전화번호')
fax_c = col_map.get('팩스번호')
hp_c = col_map.get('홈페이지')
email_c = col_map.get('이메일')
author_c = col_map.get('작성자')

rows_to_process = []
for r_idx, row in enumerate(s.iter_rows(min_row=2, max_col=max_c), start=2):
    author = str(row[author_c-1].value) if author_c and row[author_c-1].value else ''
    if '배현명(7.20~)' in author:
        biz = row[biz_c-1].value if biz_c else ''
        comp = row[comp_c-1].value if comp_c else ''
        
        fax = row[fax_c-1].value if fax_c else ''
        hp = row[hp_c-1].value if hp_c else ''
        email = row[email_c-1].value if email_c else ''
        
        # 공란이 하나라도 있으면 보완 대상
        if not fax or not hp or not email or str(fax).strip() in ['-', ''] or str(hp).strip() in ['-', ''] or str(email).strip() in ['-', '']:
            rows_to_process.append((r_idx, biz, comp, row))

print(f"2. 보완 대상 기업: {len(rows_to_process)}개 기업 비즈노/머니핀 웹 조회 시작...")

filled_fax = 0
filled_hp = 0
filled_email = 0

def fetch_and_apply(item):
    r_idx, biz, comp, _ = item
    return r_idx, fetch_info(biz, comp)

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = {executor.submit(fetch_and_apply, item): item for item in rows_to_process}
    for future in concurrent.futures.as_completed(futures):
        item = futures[future]
        r_idx, info = future.result()
        row = item[3]
        
        # 팩스 보완
        if fax_c and info['팩스번호']:
            cell = row[fax_c-1]
            if not cell.value or str(cell.value).strip() in ['-', '']:
                cell.value = info['팩스번호']
                cell.fill = yellow_fill
                filled_fax += 1
                
        # 홈페이지 보완
        if hp_c and info['홈페이지']:
            cell = row[hp_c-1]
            if not cell.value or str(cell.value).strip() in ['-', '']:
                url, is_v = check_url(info['홈페이지'])
                if is_v:
                    cell.value = url
                    cell.fill = yellow_fill
                    filled_hp += 1
                    
        # 이메일 보완
        if email_c and info['이메일']:
            cell = row[email_c-1]
            if not cell.value or str(cell.value).strip() in ['-', '']:
                em, is_v = check_email(info['이메일'])
                if is_v:
                    cell.value = em
                    cell.fill = yellow_fill
                    filled_email += 1

print(f"3. 웹 데이터 추가 보완 결과:")
print(f" - 팩스번호 신규 채움: {filled_fax}개")
print(f" - 접속가능 홈페이지 신규 채움: {filled_hp}개")
print(f" - 유효 이메일 신규 채움: {filled_email}개")

print("4. 결과 저장 중...")
wb.save(f_out)
print(f"✅ 웹 보완 반영 완료: {f_out}")
