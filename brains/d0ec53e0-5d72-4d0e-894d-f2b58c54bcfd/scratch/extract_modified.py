# -*- coding: utf-8 -*-
import openpyxl, os, sys, json, datetime
sys.stdout.reconfigure(encoding='utf-8')

today_dir = r"C:\Users\lg\Desktop\Today"
target_p = os.path.join(today_dir, "(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx")
backup_recent = os.path.join(today_dir, "(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_BACKUP_20260930_0958.xlsx")
backup_orig = os.path.join(today_dir, "(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명__BACKUP_20260921_090440.xlsx")

wb_t = openpyxl.load_workbook(target_p, data_only=True)
wb_rec = openpyxl.load_workbook(backup_recent, data_only=False)
wb_orig = openpyxl.load_workbook(backup_orig, data_only=True)

ws_t = wb_t['기업체 리스트']
ws_rec = wb_rec['기업체 리스트']
ws_orig = wb_orig['기업체 리스트']

headers = [ws_t.cell(1, c).value for c in range(1, ws_t.max_column+1)]

def to_str(val):
    if val is None:
        return ""
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.strftime('%Y-%m-%d')
    return str(val)

# 1. Recent 54 companies
recent_54 = []
for r in range(2, 2315):
    changed_items = []
    for c in range(1, ws_t.max_column+1):
        cell_p = ws_rec.cell(r, c)
        cell_t = ws_t.cell(r, c)
        was_red = cell_p.font and cell_p.font.color and str(cell_p.font.color.rgb) in ['FFFF0000', 'FFFF3300', 'FFED0000']
        now_red = cell_t.font and cell_t.font.color and str(cell_t.font.color.rgb) in ['FFFF0000', 'FFFF3300', 'FFED0000']
        if not was_red and now_red:
            h = headers[c-1] if c <= len(headers) else f"Col{c}"
            changed_items.append((h, to_str(cell_t.value)))
    if changed_items:
        recent_54.append({
            'row': r,
            'seq': ws_t.cell(r, 2).value,
            'name': ws_t.cell(r, 3).value,
            'bizno': ws_t.cell(r, 4).value,
            'rep': ws_t.cell(r, 7).value,
            'cat': ws_t.cell(r, 12).value,
            'items': changed_items
        })

# 2. All modified companies vs original backup
all_modified = []
for r in range(2, 2315):
    red_items = []
    for c in range(1, ws_t.max_column+1):
        cell = ws_t.cell(r, c)
        if cell.font and cell.font.color and str(cell.font.color.rgb) in ['FFFF0000', 'FFFF3300', 'FFED0000']:
            h = headers[c-1] if c <= len(headers) else f"Col{c}"
            red_items.append((h, to_str(cell.value)))
    if red_items:
        all_modified.append({
            'row': r,
            'seq': ws_t.cell(r, 2).value,
            'name': ws_t.cell(r, 3).value,
            'bizno': ws_t.cell(r, 4).value,
            'rep': ws_t.cell(r, 7).value,
            'cat': ws_t.cell(r, 12).value,
            'red_count': len(red_items),
            'items': red_items
        })

out_data = {
    'recent_54_count': len(recent_54),
    'recent_54': recent_54,
    'all_modified_count': len(all_modified),
    'all_modified': all_modified
}

out_path = r"C:\Users\lg\.gemini\antigravity\brain\d0ec53e0-5d72-4d0e-894d-f2b58c54bcfd\scratch\modified_companies.json"
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(out_data, f, ensure_ascii=False, indent=2)

print("SUCCESS: JSON written! Recent 54 count:", len(recent_54), "All modified count:", len(all_modified))