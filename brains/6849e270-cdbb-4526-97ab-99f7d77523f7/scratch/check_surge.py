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

print("=== 행 500 ~ 560 기업 상세 ===")
for i in range(498, 560):
    r = all_rows[i]
    print(f"[{i+1:3d}] {r[2]:25s} | 사업자: {r[3]:10s} | 법인번호: {r[13]:15s} | 결산월: {r[14]:4s}")
