import json

transcript_path = r"C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\.system_generated\logs\transcript_full.jsonl"

last_user_content = None
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'USER_INPUT':
                last_user_content = data.get('content', '')
        except Exception as e:
            pass

if last_user_content:
    print(f"Total length of user text: {len(last_user_content)}")
    lines = [l for l in last_user_content.split('\n') if l.strip()]
    print(f"Total non-empty lines: {len(lines)}")
    print("First 3 lines:")
    for l in lines[:3]:
        print(" ", l[:100])
    print("Last 3 lines:")
    for l in lines[-3:]:
        print(" ", l[:100])
        
    # Save as raw TSV
    with open(r'C:\Users\lg\.gemini\antigravity\brain\6849e270-cdbb-4526-97ab-99f7d77523f7\scratch\user_uploaded_raw.tsv', 'w', encoding='utf-8') as out_f:
        out_f.write(last_user_content)
    print("Saved user_uploaded_raw.tsv")
else:
    print("No user input found.")
