import openpyxl
import sys

sys.stdout.reconfigure(encoding='utf-8')

wb_path = r"C:\Users\lg\Desktop\Today\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx"
wb = openpyxl.load_workbook(wb_path, read_only=True, data_only=True)
ws = wb["기업체 리스트"]

# Check header rows (first 3 rows)
for r in range(1, 4):
    row_vals = [ws.cell(r, c).value for c in range(1, 45)]
    print(f"Row {r}: {row_vals}")

# Sample some rows with business numbers (e.g. rows 4 to 10)
print("\n--- Sample data rows 4 to 8 ---")
for r in range(4, 9):
    row_vals = [ws.cell(r, c).value for c in range(1, 35)]
    non_empty = [(openpyxl.utils.get_column_letter(c), ws.cell(1, c).value, ws.cell(r, c).value) for c in range(1, 35) if ws.cell(r, c).value is not None]
    print(f"\nRow {r}:")
    for col_let, h_val, val in non_empty:
        print(f"  [{col_let}] {h_val}: {val}")

wb.close()
