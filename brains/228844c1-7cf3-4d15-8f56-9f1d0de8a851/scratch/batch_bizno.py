import urllib.request
import urllib.parse
import json
import re

targets = [
    {"row": 1091, "name": "작은통일", "alt": "작은통일출판사", "area": "강서구", "type": "출판"},
    {"row": 1113, "name": "조나단", "alt": "이은석", "area": "", "type": "애니메이션"},
    {"row": 1115, "name": "족보만드는곳족보관", "alt": "족보관", "area": "중구", "phone": "051-248-9529", "addr": "부산 중구 구덕로 19", "type": "출판"},
    {"row": 1136, "name": "지엠이에스티", "alt": "지엠이에스티부산지점", "rep": "이나현", "type": "캐릭터"},
    {"row": 1146, "name": "창작집단1407", "phone": "010-6767-9391", "type": "만화"},
    {"row": 1147, "name": "창작집단한", "phone": "010-9980-9771", "type": "공연"},
    {"row": 1149, "name": "채널부산", "rep": "박민규", "type": "광고"},
    {"row": 1158, "name": "체스테크", "phone": "010-2284-9107", "area": "북구", "type": "게임"},
    {"row": 1162, "name": "최원욱", "alt": "촬영감독최원욱", "type": "영화"},
    {"row": 1165, "name": "카다모임", "rep": "이제은", "phone": "010-5407-7016", "type": "지식정보"},
    {"row": 1166, "name": "카리시모", "rep": "박소영", "phone": "010-2412-5691", "type": "캐릭터"},
    {"row": 1167, "name": "컬러풀미카", "rep": "김다형", "phone": "010-9480-3326", "type": "만화"},
    {"row": 1179, "name": "코리아헤럴드내외경제신문", "rep": "김종욱", "type": "출판"},
    {"row": 1192, "name": "킴엔존슨", "phone": "051-645-0535", "addr": "부산 부산진구 범일로 181", "type": "출판"},
    {"row": 1194, "name": "타원글로벌", "area": "사상구", "type": "게임"}
]

results = {}

for t in targets:
    q = t.get("name")
    print(f"Searching bizno for {q}...")
    url = f"https://bizno.net/?area=%EB%B6%80%EC%82%B0&query=" + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read()
            html = raw.decode('utf-8', errors='ignore')
            items = []
            matches = re.findall(r'<a[^>]+href="(/article/(\d+))"[^>]*>(.*?)</a>', html, re.DOTALL)
            for link, bno, title in matches:
                clean_title = re.sub(r'<[^>]+>', '', title).strip()
                if clean_title and len(bno) == 10:
                    items.append({"bno": bno, "title": clean_title, "link": link})
            results[q] = items
    except Exception as e:
        results[q] = str(e)

with open("C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/bizno_batch_1.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Bizno batch 1 completed")
