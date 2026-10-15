import os
import glob
import time
import openpyxl

paths_to_check = [
    r"C:\Users\lg\Desktop\오늘\*.xlsx",
    r"C:\Users\lg\Desktop\*.xlsx"
]

all_files = []
for p in paths_to_check:
    for f in glob.glob(p):
        mtime = os.path.getmtime(f)
        size_mb = os.path.getsize(f) / (1024 * 1024)
        all_files.append((f, mtime, size_mb))

all_files.sort(key=lambda x: x[1], reverse=True)

print("=== Recently Modified Excel Files on Desktop ===")
for f, mt, sz in all_files[:10]:
    t_str = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(mt))
    print(f"[{t_str}] {sz:6.2f} MB | {f}")
