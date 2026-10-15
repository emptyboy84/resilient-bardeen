import json
import re

# 1. Load Master DB matches
with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/resolved_from_master.json', encoding='utf-8') as f:
    master_matches = json.load(f)

# 2. Load Bizno high confidence
with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_high_confidence.json', encoding='utf-8') as f:
    bizno_high = json.load(f)

# 3. Load Bizno low confidence
with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_low_confidence.json', encoding='utf-8') as f:
    bizno_low = json.load(f)

# False positive keywords or target names to explicitly blacklist
BLACKLIST_TITLES = [
    '고움 살롱', '명륜진사갈비', '삼겹파티', '신흥상운', '김지원헤어샵',
    '선민회계법인', '비트시스템', '정석'
]

resolved_by_row = {}

def format_bno(b):
    if not b:
        return ""
    b_clean = re.sub(r'[^0-9]', '', str(b))
    if len(b_clean) == 10:
        return f"{b_clean[:3]}-{b_clean[3:5]}-{b_clean[5:]}"
    return str(b)

# A. First, inject previously verified 15 rows
resolved_by_row[1091] = {
    "biz": "251002015000001",
    "est_year": "2015",
    "est_month": "1",
    "rep": "",
    "close_date": "",
    "note": "문체부 정식 인허가 출판사(강서구 제2015-1호)"
}
resolved_by_row[1113] = {"biz": "", "close_date": "", "note": "확인불가(프리랜서 창작자)"}
resolved_by_row[1115] = {"biz": "", "close_date": "", "note": "확인불가(미등록 개인공방)"}
resolved_by_row[1136] = {
    "biz": "120-87-38081",
    "est_year": "2009",
    "est_month": "4",
    "rep": "이나현",
    "close_date": "",
    "note": "본사 (주)지엠이에스티(110111-4067967)"
}
resolved_by_row[1146] = {"biz": "", "close_date": "", "note": "확인불가(미등록 창작팀)"}
resolved_by_row[1147] = {"biz": "", "close_date": "", "note": "확인불가(미등록 창작극단)"}
resolved_by_row[1149] = {
    "biz": "387-85-01558",
    "est_year": "2016",
    "est_month": "1",
    "rep": "박민규",
    "close_date": "2024-03-12",
    "note": "폐업자(2024-03-12)"
}
resolved_by_row[1158] = {"biz": "", "close_date": "", "note": "확인불가"}
resolved_by_row[1162] = {"biz": "", "close_date": "", "note": "확인불가(프리랜서 촬영감독)"}
resolved_by_row[1165] = {"biz": "", "close_date": "", "note": "확인불가(미등록 창작모임)"}
resolved_by_row[1166] = {"biz": "", "close_date": "", "note": "확인불가(프리랜서 창작자)"}
resolved_by_row[1167] = {"biz": "", "close_date": "", "note": "확인불가(프리랜서 웹툰작가)"}
resolved_by_row[1179] = {
    "biz": "604-02-56085",
    "est_year": "2012",
    "est_month": "12",
    "rep": "김종욱",
    "close_date": "2024-06-30",
    "note": "폐업자(2024-06-30)"
}
resolved_by_row[1192] = {"biz": "", "close_date": "", "note": "확인불가(폐업/미등록)"}
resolved_by_row[1194] = {"biz": "", "close_date": "", "note": "확인불가"}

# B. Add Master DB matches
for m in master_matches:
    row_idx = m['target']['row_idx']
    if row_idx in resolved_by_row and resolved_by_row[row_idx].get('biz'):
        continue
    src = m['source']
    
    # parse est date
    est_date = str(src.get('est_date', '')).strip()
    est_year = ""
    est_month = ""
    m_est = re.search(r'(\d{4})[-.]?(\d{2})?', est_date)
    if m_est:
        est_year = m_est.group(1)
        if m_est.group(2):
            est_month = str(int(m_est.group(2)))
            
    close_date = str(src.get('close_date', '')).strip()
    note = str(src.get('note', '')).strip()
    if close_date and not note:
        note = f"폐업자({close_date})"
        
    resolved_by_row[row_idx] = {
        "biz": format_bno(src['biz']),
        "est_year": est_year,
        "est_month": est_month,
        "rep": src.get('rep', ''),
        "close_date": close_date,
        "note": note or "실사DB 매칭"
    }

# C. Add Bizno High Confidence matches
for m in bizno_high:
    row_idx = m['target']['row_idx']
    if row_idx in resolved_by_row and resolved_by_row[row_idx].get('biz'):
        continue
        
    est_date = str(m.get('est_date', '')).strip()
    est_year = ""
    est_month = ""
    m_est = re.search(r'(\d{4})[-.]?(\d{2})?', est_date)
    if m_est:
        est_year = m_est.group(1)
        if m_est.group(2):
            est_month = str(int(m_est.group(2)))
            
    close_date = str(m.get('close_date', '')).strip()
    status = m.get('status', '')
    note = ""
    if status == '폐업자':
        note = f"폐업자({close_date})" if close_date else "폐업자"
    elif status == '계속사업자':
        note = ""
        
    resolved_by_row[row_idx] = {
        "biz": format_bno(m['bno']),
        "est_year": est_year,
        "est_month": est_month,
        "rep": m.get('rep', ''),
        "close_date": close_date,
        "note": note
    }

# D. Add Bizno Low Confidence matches (curated filter)
for m in bizno_low:
    row_idx = m['target']['row_idx']
    if row_idx in resolved_by_row and resolved_by_row[row_idx].get('biz'):
        continue
        
    m_title = m.get('title', '')
    if any(bl in m_title for bl in BLACKLIST_TITLES):
        continue
        
    t_name = re.sub(r'[\s\(\)주식회사㈜\[\]\-_,./]', '', m['target']['name']).lower()
    c_title = re.sub(r'[\s\(\)주식회사㈜\[\]\-_,./]', '', m_title).lower()
    
    # Must have strong name alignment (exact or target in candidate)
    if t_name in c_title or c_title in t_name:
        est_date = str(m.get('est_date', '')).strip()
        est_year = ""
        est_month = ""
        m_est = re.search(r'(\d{4})[-.]?(\d{2})?', est_date)
        if m_est:
            est_year = m_est.group(1)
            if m_est.group(2):
                est_month = str(int(m_est.group(2)))
                
        close_date = str(m.get('close_date', '')).strip()
        status = m.get('status', '')
        note = ""
        if status == '폐업자':
            note = f"폐업자({close_date})" if close_date else "폐업자"
            
        resolved_by_row[row_idx] = {
            "biz": format_bno(m['bno']),
            "est_year": est_year,
            "est_month": est_month,
            "rep": m.get('rep', ''),
            "close_date": close_date,
            "note": note
        }

print(f"Total rows resolved with data/status: {len(resolved_by_row)}")
with_biz = sum(1 for v in resolved_by_row.values() if v.get('biz'))
without_biz = sum(1 for v in resolved_by_row.values() if not v.get('biz'))
print(f"  - With business registration number: {with_biz}")
print(f"  - With confirmed 확인불가: {without_biz}")

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/resolved_by_row.json', 'w', encoding='utf-8') as f:
    json.dump({str(k): v for k, v in resolved_by_row.items()}, f, ensure_ascii=False, indent=2)
