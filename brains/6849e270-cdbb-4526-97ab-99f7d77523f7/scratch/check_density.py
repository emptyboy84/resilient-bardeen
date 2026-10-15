import json

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
        while len(cols) < 18:
            cols.append('')
        all_rows.append(cols)

# Check sliding window of corp_no density
window_size = 50
print("=== 법인번호 기재 밀도 (50개 행 단위) ===")
for start in range(0, len(all_rows), window_size):
    end = min(len(all_rows), start + window_size)
    count = sum(1 for i in range(start, end) if all_rows[i][13].strip())
    print(f"행 {start+1:3d} ~ {end:3d} : {count:2d}/{end-start}건 ({count/(end-start)*100:.1f}%)")

# Check specific ranges like row 400 to 650
print("\n=== 건설/제조/법인 집중 구간 (행 430 ~ 650 샘플) ===")
for i in range(430, 480):
    r = all_rows[i]
    print(f"[{i+1:3d}] {r[2]:25s} | 법인번호: {r[13]:15s} | 업종: {r[12][:20]}")
