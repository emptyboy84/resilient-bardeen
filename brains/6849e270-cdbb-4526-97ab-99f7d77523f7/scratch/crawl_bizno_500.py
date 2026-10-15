import urllib.request
import urllib.parse
import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
}

def clean_html(text):
    if not text:
        return ''
    text = re.sub(r'<script.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<style.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'&nbsp;', ' ', text)
    text = re.sub(r'&amp;', '&', text)
    text = re.sub(r'&lt;', '<', text)
    text = re.sub(r'&gt;', '>', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def fetch_bizno_data(bno, cname=''):
    if not bno or len(bno) < 10:
        return {}
    
    clean_bno = re.sub(r'[^0-9]', '', bno)
    url = f"https://bizno.net/article/{clean_bno}"
    req = urllib.request.Request(url, headers=headers)
    
    html = ""
    try:
        with urllib.request.urlopen(req, timeout=6) as response:
            html = response.read().decode('utf-8', errors='ignore')
    except Exception:
        # Try search query
        try:
            search_url = f"https://bizno.net/?query={urllib.parse.quote(clean_bno)}"
            req_s = urllib.request.Request(search_url, headers=headers)
            with urllib.request.urlopen(req_s, timeout=6) as response:
                html = response.read().decode('utf-8', errors='ignore')
        except Exception:
            return {}

    if not html:
        return {}

    details = {}
    tr_matches = re.findall(r'<tr[^>]*>(.*?)</tr>', html, flags=re.DOTALL | re.IGNORECASE)
    for tr in tr_matches:
        th_match = re.search(r'<th[^>]*>(.*?)</th>', tr, flags=re.DOTALL | re.IGNORECASE)
        td_match = re.search(r'<td[^>]*>(.*?)</td>', tr, flags=re.DOTALL | re.IGNORECASE)
        if th_match and td_match:
            k = clean_html(th_match.group(1))
            v = clean_html(td_match.group(1))
            if k and v:
                details[k] = v

    dt_matches = re.findall(r'<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>', html, flags=re.DOTALL | re.IGNORECASE)
    for dt, dd in dt_matches:
        k = clean_html(dt)
        v = clean_html(dd)
        if k and v:
            details[k] = v

    # Extract title / company name from h1 or strong if available
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, flags=re.DOTALL | re.IGNORECASE)
    if h1_match:
        details['_title'] = clean_html(h1_match.group(1))
        
    return details

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\targets_500.json', 'r', encoding='utf-8') as f:
    targets = json.load(f)

print(f"Starting crawl for {len(targets)} companies...")

results = []
start_time = time.time()

def process_target(idx, item):
    bno = item['bno']
    cname = item['cname']
    biz_data = fetch_bizno_data(bno, cname)
    return idx, item, biz_data

with ThreadPoolExecutor(max_workers=12) as executor:
    futures = [executor.submit(process_target, i, item) for i, item in enumerate(targets)]
    for future in as_completed(futures):
        idx, item, biz_data = future.result()
        
        # Merge data
        # 1. Company name
        res_cname = item['cname']
        if biz_data.get('회사명'):
            res_cname = biz_data.get('회사명')
        elif biz_data.get('상호명'):
            res_cname = biz_data.get('상호명')
            
        # 2. Business number
        res_bno = item['bno']
        if biz_data.get('사업자등록번호'):
            res_bno = re.sub(r'[^0-9]', '', biz_data['사업자등록번호'])
            
        # 3. CEO
        res_ceo = item['ceo']
        if not res_ceo or '*' in res_ceo:
            biz_ceo = biz_data.get('대표자명', '')
            if biz_ceo and '*' not in biz_ceo:
                res_ceo = biz_ceo
                
        # 4. Zip code
        res_zip = item['zip']
        if biz_data.get('우편번호'):
            zip_cand = re.sub(r'[^0-9]', '', biz_data['우편번호'])
            if len(zip_cand) == 5:
                res_zip = zip_cand
                
        # 5. Address
        res_addr = item['addr']
        if biz_data.get('회사주소'):
            addr_cand = biz_data.get('회사주소')
            # clean address extra notes
            addr_cand = re.sub(r'\(일부는.*?\)', '', addr_cand).strip()
            # remove duplicate road/jibun if concatenated
            if not res_addr or len(addr_cand) > len(res_addr) and '***' not in addr_cand:
                res_addr = addr_cand
                
        # 6. Phone
        res_phone = item['phone']
        if not res_phone or res_phone in ['-', '0', '폐업', '.']:
            p_cand = biz_data.get('전화번호', '')
            if p_cand and '***' not in p_cand and not any(tax in p_cand for tax in ['051-740-9200', '051-310-6200']):
                res_phone = p_cand
            else:
                res_phone = ''
        if '***' in res_phone:
            res_phone = ''
            
        # 7. Fax
        res_fax = item['fax']
        if not res_fax or res_fax in ['-', '0', '폐업']:
            f_cand = biz_data.get('팩스번호', '')
            if f_cand and '***' not in f_cand:
                res_fax = f_cand
            else:
                res_fax = ''
                
        # 8. Homepage
        res_homepage = item['homepage']
        if biz_data.get('홈페이지'):
            hp_cand = biz_data.get('홈페이지')
            if '@' not in hp_cand and '.' in hp_cand:
                res_homepage = hp_cand
                
        # 9. Email
        res_email = item['email']
        if biz_data.get('이메일'):
            em_cand = biz_data.get('이메일')
            if '@' in em_cand and '***' not in em_cand:
                res_email = em_cand
                
        # 10. Employees
        res_emp = item['emp']
        if not res_emp and biz_data.get('인원'):
            res_emp = re.sub(r'[^0-9]', '', biz_data['인원'])
            
        # 11. Industry (NICE / BizINFO) & Hierarchy (대/중/소)
        res_ind_nice = item['ind_nice']
        res_ind_l = item['ind_l']
        res_ind_m = item['ind_m']
        res_ind_s = item['ind_s']
        
        # Parse hierarchy from 국세청분류: "대분류 : 제조업 중분류 : 금속 가공제품 제조업 소분류 : 구조용 금속제품, 탱크 및 증기발생기 제조업 세분류 : ... 세세분류 : ..."
        raw_ind_all = biz_data.get('국세청분류', '')
        if raw_ind_all:
            m_l = re.search(r'대분류\s*:\s*([^중소세]+)', raw_ind_all)
            m_m = re.search(r'중분류\s*:\s*([^대소세]+)', raw_ind_all)
            m_s = re.search(r'소분류\s*:\s*([^대중세]+)', raw_ind_all)
            m_ss = re.search(r'세세분류\s*:\s*(.+)', raw_ind_all)
            if m_l and not res_ind_l:
                res_ind_l = m_l.group(1).strip()
            if m_m and not res_ind_m:
                res_ind_m = m_m.group(1).strip()
            if m_s and not res_ind_s:
                res_ind_s = m_s.group(1).strip()
            if m_ss and not res_ind_nice:
                res_ind_nice = m_ss.group(1).strip()
                
        if biz_data.get('주요업종') and not res_ind_nice:
            res_ind_nice = biz_data.get('주요업종')
            
        # 12. Corporate registration number
        res_corp_no = item['corp_no']
        if not res_corp_no and biz_data.get('법인등록번호'):
            res_corp_no = biz_data['법인등록번호'].strip()
            
        # 13. Settlement month
        res_settle = item['settle']
        if not res_settle:
            if res_corp_no or any(kw in res_cname for kw in ['(주)', '주식회사', '㈜', '사단법인', '유한회사', '재단법인']):
                res_settle = '12월'
                
        results.append((idx, {
            'cname': res_cname,
            'bno': res_bno,
            'ceo': res_ceo,
            'zip': res_zip,
            'addr': res_addr,
            'phone': res_phone,
            'fax': res_fax,
            'homepage': res_homepage,
            'email': res_email,
            'emp': res_emp,
            'ind_nice': res_ind_nice,
            'corp_no': res_corp_no,
            'settle': res_settle,
            'ind_l': res_ind_l,
            'ind_m': res_ind_m,
            'ind_s': res_ind_s
        }))

results.sort(key=lambda x: x[0])
print(f"Crawl completed in {time.time() - start_time:.2f} seconds.")
print(f"Total processed results: {len(results)}")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\bizno_crawled_500.json', 'w', encoding='utf-8') as f:
    json.dump([r[1] for r in results], f, ensure_ascii=False, indent=2)

print("Saved bizno_crawled_500.json successfully.")
