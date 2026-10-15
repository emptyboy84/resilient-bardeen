import openpyxl

excel_path = r"data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"
wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)
ws = wb.active

headers = None
for idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
    if idx == 1:
        headers = list(row)
    if idx == 20418:
        for i, (h, v) in enumerate(zip(headers, row), start=1):
            print(f"Col {i:02d} | {h}: {v}")
        break

wb.close()
