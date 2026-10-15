import json
import re
import os

transcript_path = r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\.system_generated\logs\transcript_full.jsonl'

user_texts = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        step = json.loads(line)
        if step.get('type') == 'USER_INPUT':
            content = step.get('content', '')
            user_texts.append(content)

print(f"Total user inputs: {len(user_texts)}")
for i, txt in enumerate(user_texts):
    print(f"Input {i}: length {len(txt)} chars, lines {len(txt.splitlines())}")

raw_lines = []
headers = None
for i in [0, 1]:  # The first two inputs contain data
    if i < len(user_texts):
        for line in user_texts[i].splitlines():
            line = line.strip('\r\n')
            if not line:
                continue
            if line.startswith('작성자\t'):
                headers = line.split('\t')
                continue
            if line == '지금까지 한거다':
                continue
            raw_lines.append(line)

print(f"Headers: {headers}")
print(f"Total data lines extracted: {len(raw_lines)}")

# Save to tsv file for analysis
with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\all_raw_data.tsv', 'w', encoding='utf-8') as f:
    if headers:
        f.write('\t'.join(headers) + '\n')
    for line in raw_lines:
        f.write(line + '\n')
