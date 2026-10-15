import openpyxl
import os

excel_path = r"data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"
if not os.path.exists(excel_path):
    # check absolute path or other files
    print("File not found in relative path, checking current dir...")
    for f in os.listdir("."):
        if f.endswith(".xlsx"):
            print("Found xlsx:", f)
    if os.path.exists("data"):
        for f in os.listdir("data"):
            print("Found in data:", f)

wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)
ws = wb.active

target_bno = "8988802742"
target_name = "케이안전기술원"

print("Searching for row...")
found = []
for idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
    row_str = " ".join([str(c) for c in row if c is not None])
    if target_bno in row_str or target_name in row_str:
        found.append((idx, row))

print(f"Found {len(found)} rows:")
for idx, r in found:
    print(f"Row {idx}: {r}")

wb.close()
