import openpyxl
import csv
import json
import re
import os

target_path = r"C:\Users\lg\Desktop\오늘\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx"
wb_target = openpyxl.load_workbook(target_path, read_only=True, data_only=True)
ws_target = wb_target[wb_target.sheetnames[0]]

empty_rows = []
for i, row in enumerate(ws_target.iter_rows(values_only=True)):
    if i == 0:
        continue
    r = [str(c) if c is not None else "" for c in row]
    # We care about rows >= 1091 (or all empty rows)
    if not r[3].strip():
        empty_rows.append({
            "row_idx": i+1,
            "순번": r[1],
            "name": r[2].strip(),
            "biz": r[3].strip(),
            "est_year": r[4].strip(),
            "est_month": r[5].strip(),
            "rep": r[6].strip(),
            "phone": r[7].strip(),
            "fax": r[8].strip(),
            "sigungu": r[9].strip(),
            "addr": r[10].strip(),
            "type": r[11].strip(),
            "contact_res": r[12].strip(),
            "close_date": r[13].strip(),
            "note": r[14].strip()
        })
wb_target.close()

print(f"Total empty rows in target: {len(empty_rows)}, with row_idx >= 1091: {len([r for r in empty_rows if r['row_idx'] >= 1091])}")

def clean_name(n):
    return re.sub(r'[\s\(\)주식회사㈜\[\]\-_,./]', '', n).lower()

def clean_phone(p):
    nums = re.sub(r'[^0-9]', '', p)
    if len(nums) >= 8 and nums.startswith('0'):
        return nums
    return nums

# 1. Index master 1: (데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx
# 2. Index master 2: 배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx
# 3. Index master 3: 배현명_실사DB_네이버_카카오_전화번호세트.csv

indexed_db = {} # clean_name -> list of records
indexed_phone = {} # clean_phone -> list of records

def add_record(name, biz, rep, phone, addr, est_date, close_date, note, src):
    if not biz:
        return
    cn = clean_name(name)
    cp = clean_phone(phone)
    rec = {
        "name": name,
        "biz": biz,
        "rep": rep,
        "phone": phone,
        "addr": addr,
        "est_date": est_date,
        "close_date": close_date,
        "note": note,
        "src": src
    }
    if cn:
        indexed_db.setdefault(cn, []).append(rec)
    if cp and len(cp) >= 7:
        indexed_phone.setdefault(cp, []).append(rec)

# Read master 2: 배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx
m2_path = 'data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx'
if os.path.exists(m2_path):
    wb2 = openpyxl.load_workbook(m2_path, read_only=True, data_only=True)
    ws2 = wb2[wb2.sheetnames[0]]
    for i, row in enumerate(ws2.iter_rows(values_only=True)):
        if i == 0:
            continue
        r = [str(c) if c is not None else "" for c in row]
        # Col 3: 회사명, Col 4: 사업자번호, Col 5: 대표자, Col 7: 주소, Col 8: 전화번호, Col 12: 설립일자, Col 13: 폐업일자
        c_name = r[3].strip() if len(r) > 3 else ""
        c_biz = r[4].strip() if len(r) > 4 else ""
        c_rep = r[5].strip() if len(r) > 5 else ""
        c_addr = r[7].strip() if len(r) > 7 else ""
        c_phone = r[8].strip() if len(r) > 8 else ""
        c_est = r[12].strip() if len(r) > 12 else ""
        c_close = r[13].strip() if len(r) > 13 else ""
        c_note = r[14].strip() if len(r) > 14 else ""
        add_record(c_name, c_biz, c_rep, c_phone, c_addr, c_est, c_close, c_note, "final_16col")
    wb2.close()

# Read master 1: (데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx
m1_path = 'data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx'
if os.path.exists(m1_path):
    wb1 = openpyxl.load_workbook(m1_path, read_only=True, data_only=True)
    for sname in wb1.sheetnames:
        ws1 = wb1[sname]
        for i, row in enumerate(ws1.iter_rows(values_only=True)):
            if i == 0:
                continue
            r = [str(c) if c is not None else "" for c in row]
            c_name = r[2].strip() if len(r) > 2 else ""
            c_biz = r[3].strip() if len(r) > 3 else ""
            c_rep = r[4].strip() if len(r) > 4 else ""
            c_addr = r[6].strip() if len(r) > 6 else ""
            c_phone = r[7].strip() if len(r) > 7 else ""
            c_est = r[12].strip() if len(r) > 12 else ""
            c_close = r[13].strip() if len(r) > 13 else ""
            c_note = r[14].strip() if len(r) > 14 else ""
            add_record(c_name, c_biz, c_rep, c_phone, c_addr, c_est, c_close, c_note, f"master_{sname}")
    wb1.close()

print(f"Total unique indexed names: {len(indexed_db)}, phones: {len(indexed_phone)}")

# Match targets >= 1091
matched = []
unmatched = []

for item in empty_rows:
    if item['row_idx'] < 1091:
        continue
    cn = clean_name(item['name'])
    cp = clean_phone(item['phone'])
    
    m_rec = None
    m_type = ""
    
    # 1. Exact clean name
    if cn and cn in indexed_db:
        m_rec = indexed_db[cn][0]
        m_type = "name_exact"
    # 2. Phone match
    elif cp and len(cp) >= 7 and cp in indexed_phone:
        m_rec = indexed_phone[cp][0]
        m_type = "phone_exact"
        
    if m_rec:
        matched.append({"target": item, "match_type": m_type, "source": m_rec})
    else:
        unmatched.append(item)

print(f"Matched: {len(matched)}, Unmatched: {len(unmatched)}")

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/resolved_from_master.json', 'w', encoding='utf-8') as f:
    json.dump(matched, f, ensure_ascii=False, indent=2)

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/unmatched_rows.json', 'w', encoding='utf-8') as f:
    json.dump(unmatched, f, ensure_ascii=False, indent=2)
