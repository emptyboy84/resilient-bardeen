import json

with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\clean_validation_results.json', 'r', encoding='utf-8') as f:
    res = json.load(f)

# Let's inspect the actual raw lines around 주식회사에스피디
transcript_path = r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\.system_generated\logs\transcript_full.jsonl'

user_texts = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        step = json.loads(line)
        if step.get('type') == 'USER_INPUT':
            content = step.get('content', '')
            user_texts.append(content)

all_rows = []
for batch_idx in [0, 1]:
    for l in user_texts[batch_idx].splitlines():
        l_str = l.strip('\r\n')
        if not l_str or l_str.startswith('<') or l_str.startswith('NOTE:') or l_str == '지금까지 한거다' or 'The user changed' in l_str or 'The current local time' in l_str or l_str.startswith('@[') or l_str.startswith('#') or l_str.startswith('작성자\t'):
            continue
        cols = l_str.split('\t')
        all_rows.append(cols)

print(f"Total extracted rows: {len(all_rows)}")

# Find index of 주식회사에스피디
spd_indices = []
for idx, r in enumerate(all_rows):
    if len(r) > 2 and '에스피디' in r[2]:
        spd_indices.append(idx)

print(f"주식회사에스피디 indices: {spd_indices}")

# Look at rows around spd
if spd_indices:
    target_idx = spd_indices[0]
    start = max(0, target_idx - 15)
    end = min(len(all_rows), target_idx + 25)
    print(f"\n--- Rows from {start} to {end} ---")
    for i in range(start, end):
        r = all_rows[i]
        name = r[2] if len(r) > 2 else ''
        biz_no = r[3] if len(r) > 3 else ''
        # Let's see what is in each column
        # In 18-col structure: 13 is corp_no, 14 is settle_month
        corp_no = r[13] if len(r) > 13 else ''
        settle = r[14] if len(r) > 14 else ''
        is_spd = " <--- [주식회사에스피디]" if i == target_idx else ""
        print(f"[{i+1:3d}] {name:20s} | 법인번호: {corp_no:15s} | 결산월: {settle:5s} | 컬럼수: {len(r)}{is_spd}")

# Overall corp_no statistics before and after spd
target_idx = spd_indices[0] if spd_indices else 273
before_spd = all_rows[:target_idx]
after_spd = all_rows[target_idx:]

corp_before = sum(1 for r in before_spd if len(r) > 13 and r[13].strip())
corp_after = sum(1 for r in after_spd if len(r) > 13 and r[13].strip())

print(f"\n[통계 분석]")
print(f"주식회사에스피디 이전 ({len(before_spd)}건): 법인번호 기재 {corp_before}건 ({corp_before/len(before_spd)*100:.1f}%)")
print(f"주식회사에스피디 이후 ({len(after_spd)}건): 법인번호 기재 {corp_after}건 ({corp_after/len(after_spd)*100:.1f}%)")
