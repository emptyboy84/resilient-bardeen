import openpyxl

excel_path = r"data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"
wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)
ws = wb.active

target_bno = "8998100224"
target_name = "탑플랜트"

headers = None
found = []
for idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
    if idx == 1:
        headers = list(row)
        continue
    row_str = " ".join([str(c) for c in row if c is not None])
    if target_bno in row_str or target_name in row_str:
        found.append((idx, list(row)))

print(f"Found {len(found)} rows:")
for idx, r in found:
    print(f"--- Row {idx} ---")
    for i, (h, v) in enumerate(zip(headers, r), start=1):
        if v is not None:
            print(f"Col {i:02d} | {h}: {v}")

wb.close()
