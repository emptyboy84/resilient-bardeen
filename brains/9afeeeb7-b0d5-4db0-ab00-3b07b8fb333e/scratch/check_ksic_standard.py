import openpyxl

excel_path = r"data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"
wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)
ws = wb.active

for idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
    r18 = str(row[17]) if len(row) > 17 else ""
    if "특수목적" in r18 or "292" in str(row[15:18]):
        # check if col 48~50 (index 47~49) has values
        c48 = row[47] if len(row) > 47 else None
        c49 = row[48] if len(row) > 48 else None
        c50 = row[49] if len(row) > 49 else None
        if c48 or c49 or c50:
            print(f"Row {idx}: {r18} -> {c48} | {c49} | {c50}")
            break

wb.close()
