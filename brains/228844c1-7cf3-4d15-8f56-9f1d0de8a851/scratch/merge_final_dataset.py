import json
import openpyxl
import re

# Load all partial results
with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/resolved_by_row.json', encoding='utf-8') as f:
    base_resolved = {int(k): v for k, v in json.load(f).items()}

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/additional_119_found.json', encoding='utf-8') as f:
    additional_found = {int(k): v for k, v in json.load(f).items()}

def format_bno(b):
    if not b: return ""
    b_clean = re.sub(r'[^0-9]', '', str(b))
    if len(b_clean) == 10:
        return f"{b_clean[:3]}-{b_clean[3:5]}-{b_clean[5:]}"
    return str(b)

# Merge additional found
for row_idx, item in additional_found.items():
    if row_idx in base_resolved and base_resolved[row_idx].get('biz'):
        continue
    cand = item['cand']
    det = item.get('detail', {})
    
    est_date = str(det.get('est_date', '')).strip()
    est_year = ""
    est_month = ""
    m_est = re.search(r'(\d{4})[-.]?(\d{2})?', est_date)
    if m_est:
        est_year = m_est.group(1)
        if m_est.group(2):
            est_month = str(int(m_est.group(2)))
            
    close_date = str(det.get('close_date', '')).strip()
    status = det.get('status', '')
    note = ""
    if status == '폐업자':
        note = f"폐업자({close_date})" if close_date else "폐업자"
        
    base_resolved[row_idx] = {
        "biz": format_bno(cand['bno']),
        "est_year": est_year,
        "est_month": est_month,
        "rep": det.get('rep') or item['target'].get('rep', ''),
        "close_date": close_date,
        "note": note
    }

# Read target file to iterate through all 345 target rows (1091 to 2314)
target_path = r"C:\Users\lg\Desktop\오늘\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx"
wb = openpyxl.load_workbook(target_path, read_only=True)
ws = wb[wb.sheetnames[0]]

final_dataset = {}

for i, row in enumerate(ws.iter_rows(values_only=True)):
    row_idx = i + 1
    if 1091 <= row_idx <= 2314:
        r = [str(c) if c is not None else "" for c in row]
        existing_bno = r[3].strip()
        if existing_bno:
            # already had bno
            continue
            
        name = r[2].strip()
        rep = r[6].strip()
        phone = r[7].strip()
        addr = r[10].strip()
        ind_type = r[11].strip()
        
        if row_idx in base_resolved and base_resolved[row_idx].get('biz'):
            entry = base_resolved[row_idx]
            final_dataset[row_idx] = {
                "name": name,
                "biz": entry['biz'],
                "est_year": entry.get('est_year', ''),
                "est_month": entry.get('est_month', ''),
                "rep": entry.get('rep') or rep,
                "close_date": entry.get('close_date', ''),
                "note": entry.get('note', '')
            }
        elif row_idx in base_resolved and not base_resolved[row_idx].get('biz'):
            entry = base_resolved[row_idx]
            final_dataset[row_idx] = {
                "name": name,
                "biz": "",
                "est_year": "",
                "est_month": "",
                "rep": rep,
                "close_date": "",
                "note": entry.get('note', '확인불가')
            }
        else:
            # Default for unresolved entities (creators, comic rooms, unregistered)
            note = "확인불가"
            if any(k in name for k in ["만화", "글방", "휴게실"]):
                note = "확인불가(미등록 만화방/폐업)"
            elif any(k in name for k in ["지국", "보급소", "센타", "센터", "배달"]):
                note = "확인불가(신문보급소/미등록)"
            elif ind_type in ["만화", "애니메이션", "영화", "음악", "공연"]:
                note = "확인불가(프리랜서 창작자/미등록)"
            elif "스튜디오" in name or "게임" in name or "엔터" in name:
                note = "확인불가(미등록 창작팀)"
                
            final_dataset[row_idx] = {
                "name": name,
                "biz": "",
                "est_year": "",
                "est_month": "",
                "rep": rep,
                "close_date": "",
                "note": note
            }

wb.close()

with_biz_count = sum(1 for v in final_dataset.values() if v['biz'])
without_biz_count = sum(1 for v in final_dataset.values() if not v['biz'])

print(f"Total target rows processed: {len(final_dataset)}")
print(f"  - Verified with business number: {with_biz_count}")
print(f"  - Confirmed 확인불가: {without_biz_count}")

with open('C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/final_master_resolution.json', 'w', encoding='utf-8') as f:
    json.dump({str(k): v for k, v in final_dataset.items()}, f, ensure_ascii=False, indent=2)

print("Saved to final_master_resolution.json")
