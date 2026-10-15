import json
import re

transcript_path = r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\.system_generated\logs\transcript_full.jsonl'

user_texts = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        step = json.loads(line)
        if step.get('type') == 'USER_INPUT':
            content = step.get('content', '')
            user_texts.append(content)

# Batch 2 is user_texts[1]
batch2_lines = user_texts[1].splitlines()
new_corp_rows = []

for idx, l in enumerate(batch2_lines, 1):
    l_str = l.strip('\r\n')
    if not l_str or l_str.startswith('<') or l_str.startswith('NOTE:') or l_str == '지금까지 한거다' or 'The user changed' in l_str or 'The current local time' in l_str or l_str.startswith('@[') or l_str.startswith('#') or l_str.startswith('작성자\t'):
        continue
    
    cols = l_str.split('\t')
    while len(cols) < 18:
        cols.append('')
        
    author = cols[0].strip()
    note = cols[1].strip()
    name = cols[2].strip()
    biz_no = cols[3].strip()
    ceo = cols[4].strip()
    corp_no = cols[13].strip()
    settle = cols[14].strip()
    nice_ind = cols[12].strip()
    
    # Check if this row is 주식회사에스피디 which the user just updated
    if '에스피디' in name:
        corp_no = '180111-0650556'
        settle = '12월'
        
    if corp_no:
        new_corp_rows.append({
            'index': len(new_corp_rows) + 1,
            'name': name,
            'biz_no': biz_no,
            'ceo': ceo,
            'corp_no': corp_no,
            'settle': settle,
            'industry': nice_ind,
            'note': note
        })

print(f"Total newly added rows with corp_no in batch 2: {len(new_corp_rows)}")

# Save to text/json
with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\newly_added_corp_nos.json', 'w', encoding='utf-8') as f:
    json.dump(new_corp_rows, f, ensure_ascii=False, indent=2)

lines = []
lines.append(f"총 {len(new_corp_rows)}건의 새로 추가된 법인번호 목록입니다.\n")
lines.append(f"| 번호 | 회사명 | 사업자등록번호 | 대표자 | 법인등록번호 | 결산월 | 업종 | 비고 |")
lines.append(f"| :---: | :--- | :---: | :---: | :---: | :---: | :--- | :---: |")

for r in new_corp_rows:
    note_str = f" ({r['note']})" if r['note'] else ""
    lines.append(f"| {r['index']} | {r['name']} | {r['biz_no']} | {r['ceo']} | **{r['corp_no']}** | {r['settle']} | {r['industry']} | {r['note']} |")

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\newly_added_corp_nos.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Saved newly_added_corp_nos.txt successfully.")
