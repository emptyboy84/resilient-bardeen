import openpyxl

target_path = r"C:\Users\lg\Desktop\오늘\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx"

try:
    wb = openpyxl.load_workbook(target_path)
    ws = wb[wb.sheetnames[0]]
    header = [ws.cell(row=1, column=c).value for c in range(1, 17)]
    print("Header columns:")
    for idx, h in enumerate(header, 1):
        print(f"  Col {idx}: {h}")
    wb.close()
    print("Workbook successfully opened and closed (Writable).")
except Exception as e:
    print("Error opening workbook:", e)
