with open("C:/Users/lg/.gemini/antigravity/brain/9afeeeb7-b0d5-4db0-ab00-3b07b8fb333e/scratch/nicebiz_res.html", "r", encoding="utf-8") as f:
    text = f.read()

import re
forms = re.findall(r'<form[^>]*action="([^"]*)"[^>]*>', text)
print("Forms:", forms)
inputs = re.findall(r'<input[^>]*name="([^"]*)"[^>]*>', text)
print("Inputs:", set(inputs))
