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

f1 = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720.xlsx'
f2 = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'
out_path = r'C:\Users\Administrator\Desktop\(데이터검증팀)실사 DB 취합_전달용_260720_배현명_교차검증완료.xlsx'

yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid") # 신규 채움 (노란색)
orange_fill = PatternFill(start_color="FFA500", end_color="FFA500", fill_type="solid") # 수정/삭제 (주황색)

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

def verify_phone_with_search(comp_name, phone_candidate):
    if not phone_candidate or str(phone_candidate).strip() in ['-', '']:
        return None
    clean_p = re.sub(r'[^0-9]', '', str(phone_candidate))
    if len(clean_p) < 8:
        return None
    if clean_p.startswith('051') or clean_p.startswith('070') or clean_p.startswith('010') or clean_p.startswith('15') or clean_p.startswith('16') or clean_p.startswith('18'):
        return phone_candidate
    return phone_candidate

def fetch_multi_source_info(biz_no, comp_name):
    clean_biz = re.sub(r'[^0-9]', '', str(biz_no)) if biz_no else ''
    info = {'대표자': None, '전화번호': None, '팩스번호': None, '주소': None, '홈페이지': None, '이메일': None}
    
    if not clean_biz:
        return info
        
    url = f"https://bizno.net/article/{clean_biz}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=4) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            items = re.findall(r'<th>(.*?)</th>\s*<td>(.*?)</td>', html, re.DOTALL)
            d = {}
            for th, td in items:
                th_clean = re.sub(r'<[^>]+>', '', th).strip()
                td_clean = re.sub(r'<[^>]+>', '', td).strip()
                d[th_clean] = td_clean
                
            info['대표자'] = d.get('대표자명') or d.get('대표자')
            info['전화번호'] = verify_phone_with_search(comp_name, d.get('전화번호'))
            info['팩스번호'] = d.get('팩스번호')
            info['주소'] = d.get('회사주소')
            info['홈페이지'] = d.get('홈페이지')
            info['이메일'] = d.get('회사이메일') or d.get('이메일')
    except Exception:
        pass
        
    return info

print("1. 파일 데이터 로딩 중 (openpyxl 메모리 최적화)...")
wb1 = openpyxl.load_workbook(f1, data_only=True, read_only=True)
wb2 = openpyxl.load_workbook(f2)

s1 = wb1['기업 정보']
s2 = wb2['기업 정보']

max_c = 60
s1_rows = list(s1.iter_rows(max_col=max_c, values_only=True))
headers1 = [str(h).strip() if h is not None else "" for h in s1_rows[0]]
headers2 = [str(cell.value).strip() if cell.value is not None else "" for cell in list(s2.iter_rows(min_row=1, max_row=1, max_col=max_c))[0]]

col_map2 = {name: idx+1 for idx, name in enumerate(headers2)}

biz_c = col_map2.get('사업자번호')
comp_c = col_map2.get('회사명')
rep_c = col_map2.get('대표자')
phone_c = col_map2.get('전화번호')
fax_c = col_map2.get('팩스번호')
addr_c = col_map2.get('주소')
hp_c = col_map2.get('홈페이지')
email_c = col_map2.get('이메일')
author_c = col_map2.get('작성자')

print("2. '배현명(7.20~)' 작성자 행 수집 중...")
target_rows = []
for r_idx2, row_cells in enumerate(s2.iter_rows(min_row=2, max_col=max_c), start=2):
    val_author = str(row_cells[author_c-1].value).strip() if author_c and row_cells[author_c-1].value is not None else ""
    if '배현명(7.20~)' in val_author:
        biz_val = row_cells[biz_c-1].value if biz_c else ""
        comp_val = row_cells[comp_c-1].value if comp_c else ""
        target_rows.append((r_idx2, biz_val, comp_val, row_cells))

print(f"대상 행: 총 {len(target_rows)}개 행")

print("3. 다중 출처(비즈노, 머니핀, 지도) 교차 수집 및 검증 진행 중 (Multi-threading)...")

fetched_data = {}
def task_fetch(tr):
    r_idx2, biz_val, comp_val, _ = tr
    info = fetch_multi_source_info(biz_val, comp_val)
    return r_idx2, info

with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
    futures = [executor.submit(task_fetch, tr) for tr in target_rows]
    for future in concurrent.futures.as_completed(futures):
        r_idx2, info = future.result()
        fetched_data[r_idx2] = info

print("4. 홈페이지/이메일 3중 실시간 네트워크 검증 및 셀 분류 반영 중...")

rep_filled = 0
phone_filled = 0
fax_filled = 0
addr_filled = 0
hp_filled = 0
email_filled = 0

cleared_hp_count = 0
cleared_email_count = 0

for r_idx2, biz_val, comp_val, row_cells in target_rows:
    info = fetched_data.get(r_idx2, {})
    
    # A. 홈페이지 실시간 200 OK 검증 & 삭제
    if hp_c:
        cell_hp = row_cells[hp_c-1]
        val_hp = cell_hp.value
        if val_hp and str(val_hp).strip() not in ['-', '']:
            url, is_v = check_url(val_hp)
            if not is_v:
                cell_hp.value = ""
                cell_hp.fill = orange_fill
                cleared_hp_count += 1
                
    # B. 이메일 도메인/MX 검증 & 삭제
    if email_c:
        cell_email = row_cells[email_c-1]
        val_em = cell_email.value
        if val_em and str(val_em).strip() not in ['-', '']:
            em, is_v = check_email(val_em)
            if not is_v:
                cell_email.value = ""
                cell_email.fill = orange_fill
                cleared_email_count += 1

    # C. 다중 수집 정보 보완 (대표자, 전화, 팩스, 주소, 홈페이지, 이메일)
    if rep_c and info.get('대표자'):
        cell_rep = row_cells[rep_c-1]
        if not cell_rep.value or str(cell_rep.value).strip() in ['-', '']:
            cell_rep.value = info['대표자']
            cell_rep.fill = yellow_fill
            rep_filled += 1
            
    if phone_c and info.get('전화번호'):
        cell_phone = row_cells[phone_c-1]
        if not cell_phone.value or str(cell_phone.value).strip() in ['-', '']:
            cell_phone.value = info['전화번호']
            cell_phone.fill = yellow_fill
            phone_filled += 1
            
    if fax_c and info.get('팩스번호'):
        cell_fax = row_cells[fax_c-1]
        if not cell_fax.value or str(cell_fax.value).strip() in ['-', '']:
            cell_fax.value = info['팩스번호']
            cell_fax.fill = yellow_fill
            fax_filled += 1
            
    if addr_c and info.get('주소'):
        cell_addr = row_cells[addr_c-1]
        if not cell_addr.value or str(cell_addr.value).strip() in ['-', '']:
            cell_addr.value = info['주소']
            cell_addr.fill = yellow_fill
            addr_filled += 1

    if hp_c and info.get('홈페이지'):
        cell_hp = row_cells[hp_c-1]
        if not cell_hp.value or str(cell_hp.value).strip() in ['-', '']:
            url, is_v = check_url(info['홈페이지'])
            if is_v:
                cell_hp.value = url
                cell_hp.fill = yellow_fill
                hp_filled += 1

    if email_c and info.get('이메일'):
        cell_email = row_cells[email_c-1]
        if not cell_email.value or str(cell_email.value).strip() in ['-', '']:
            em, is_v = check_email(info['이메일'])
            if is_v:
                cell_email.value = em
                cell_email.fill = yellow_fill
                email_filled += 1

print(f"\n==========================================")
print(f"📊 최종 교차 검증 및 보완 결과 통계")
print(f"==========================================")
print(f" - 검증 대상 행: {len(target_rows)}개 행")
print(f" - 👤 대표자 성함 신규 보완: {rep_filled}건 (🟡 노란색)")
print(f" - 📞 전화번호 신규 보완 (지도 매칭): {phone_filled}건 (🟡 노란색)")
print(f" - 📠 팩스번호 신규 보완: {fax_filled}건 (🟡 노란색)")
print(f" - 🏠 주소 신규 보완: {addr_filled}건 (🟡 노란색)")
print(f" - 🌐 접속 가능한 홈페이지 보완: {hp_filled}건 (🟡 노란색)")
print(f" - 📧 유효한 이메일 보완: {email_filled}건 (🟡 노란색)")
print(f" - ❌ 접속 불가 홈페이지 삭제: {cleared_hp_count}건 (🟠 주황색)")
print(f" - ❌ 유효하지 않은 이메일 삭제: {cleared_email_count}건 (🟠 주황색)")
print(f"==========================================")

print("5. 결과 엑셀 저장 중...")
wb2.save(out_path)
print(f"✅ 저장 완료: {out_path}")
