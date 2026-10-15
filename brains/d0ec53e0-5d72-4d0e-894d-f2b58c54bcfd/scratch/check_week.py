# -*- coding: utf-8 -*-
import glob, json, os, sys
from datetime import datetime
sys.stdout.reconfigure(encoding='utf-8')

brains = glob.glob(r"C:\Users\lg\.gemini\antigravity\brain\*")
this_week_events = []

for b in brains:
    tpath = os.path.join(b, ".system_generated", "logs", "transcript.jsonl")
    if not os.path.exists(tpath):
        continue
    cid = os.path.basename(b)
    with open(tpath, "r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            try:
                obj = json.loads(line)
                created = obj.get("created_at", "")
                if created >= "2026-09-28":
                    if obj.get("type") == "USER_INPUT":
                        content = obj.get("content", "").strip()
                        if "<USER_REQUEST>" in content:
                            content = content.split("<USER_REQUEST>")[1].split("</USER_REQUEST>")[0].strip()
                        this_week_events.append((created, cid, "USER", content))
                    elif obj.get("type") == "PLANNER_RESPONSE" and obj.get("status") == "DONE":
                        c = obj.get("content", "")
                        if c:
                            this_week_events.append((created, cid, "AGENT", c[:200].replace("\n", " ")))
            except:
                pass

this_week_events.sort(key=lambda x: x[0])

print("Total this week events:", len(this_week_events))
for dt, cid, role, text in this_week_events:
    if role == "USER":
        print(f"[{dt}] [{cid[:8]}] USER: {text[:120]}")