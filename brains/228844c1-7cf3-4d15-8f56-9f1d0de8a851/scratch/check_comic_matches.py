import json

with open("C:/Users/lg/.gemini/antigravity/brain/228844c1-7cf3-4d15-8f56-9f1d0de8a851/scratch/comic_rows.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Total matches:", len(data))
for item in data:
    joined = " ".join(item["row"])
    if "우수경" in joined or "이석창" in joined:
        print(item)
