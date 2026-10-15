import os
import sys

excel_path = r"C:\Users\lg\Desktop\오늘\(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"

print(f"Checking file: {excel_path}")
print(f"Exists: {os.path.exists(excel_path)}")

if os.path.exists(excel_path):
    print(f"File size: {os.path.getsize(excel_path)} bytes")
