# -*- coding: utf-8 -*-
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

targets = [
    '무몽크', '불교텔레비젼', '비문', '위플라이엔터테인먼트',
    '조나단/이은석', '족보만드는곳족보관', '창작집단1407',
    '이수연', '이지현', '이진수', '작은통일출판사',
    '동화사', '블루레코딩', '희웹툰', '우수경'
]

convs = [
    r"C:\Users\lg\.gemini\antigravity\brain\7ceb3003-3471-4163-b37b-71a60591f72d\.system_generated\logs\transcript.jsonl",
    r"C:\Users\lg\.gemini\antigravity\brain\8f22c045-be27-4b13-94fc-221f5198ed7a\.system_generated\logs\transcript.jsonl",
    r"C:\Users\lg\.gemini\antigravity\brain\8d910c96-69ac-4dcb-b68c-aa4d0f2ced8e\.system_generated\logs\transcript.jsonl",
    r"C:\Users\lg\.gemini\antigravity\brain\a97462f9-3976-4927-b799-281f20134eb3\.system_generated\logs\transcript.jsonl"
]

results = {}

for cpath in convs:
    if not os.path.exists(cpath):
        continue
    with open(cpath, 'r', encoding='utf-8', errors='ignore') as f:
        last_user = ""
        for line in f:
            try:
                obj = json.loads(line)
                if obj.get('type') == 'USER_INPUT':
                    last_user = obj.get('content', '')
                elif obj.get('type') == 'PLANNER_RESPONSE' and obj.get('status') == 'DONE':
                    content = obj.get('content', '')
                    for t in targets:
                        if t in last_user and content and len(content) > 100:
                            results[t] = content
            except:
                pass

print("Found results for targets:", len(results))
for t, content in results.items():
    print(f"\n==================== [{t}] ====================")
    # print first 500 chars
    lines = [l for l in content.split("\n") if l.strip() and not l.startswith("```")]
    print("\n".join(lines[:10]))