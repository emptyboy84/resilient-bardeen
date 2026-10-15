import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

wb_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"

try:
    with open(wb_path, "r+b") as f:
        print("Success: File is writable! (No exclusive lock)")
except PermissionError as e:
    print(f"Locked: File is currently opened with exclusive lock: {e}")
except Exception as e:
    print(f"Error checking file: {e}")
