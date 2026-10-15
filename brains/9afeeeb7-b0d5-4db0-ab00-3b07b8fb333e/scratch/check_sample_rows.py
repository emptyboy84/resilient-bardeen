import openpyxl

excel_path = r"data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx"
wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)
ws = wb.active

for idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
    if 20410 <= idx <= 20418:
        # print col 1 to 18, and col 25 (법인번호), col 31 (결산월), col 48~50 (대중소)
        print(f"Row {idx}:")
        print(f"  Col 1~7: {row[0:7]}")
        print(f"  Col 8~15: {row[7:15]}")
        print(f"  Col 18(NICE): {row[17]}, Col 25(법인번호): {row[24]}, Col 31(결산월): {row[30]}")
        print(f"  Col 48~50(대중소): {row[47:50]}")

wb.close()
