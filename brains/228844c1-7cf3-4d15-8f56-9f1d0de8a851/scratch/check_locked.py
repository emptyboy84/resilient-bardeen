import os

target_path = r"C:\Users\lg\Desktop\오늘\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx"
try:
    with open(target_path, "a") as f:
        print("File is writable (not locked by Excel).")
except PermissionError:
    print("File is LOCKED by another process (likely Excel).")
except Exception as e:
    print("Error:", e)
