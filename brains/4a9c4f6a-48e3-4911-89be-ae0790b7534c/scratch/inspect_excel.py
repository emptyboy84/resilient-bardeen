import os
import openpyxl

path = r"C:\Users\lg\Desktop\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명.xlsx"
print("File exists:", os.path.exists(path))
if os.path.exists(path):
    print("File size:", os.path.getsize(path))
    try:
        wb = openpyxl.load_workbook(path, data_only=True)
        print("Sheets:", wb.sheetnames)
        for name in wb.sheetnames:
            ws = wb[name]
            print(f"--- Sheet: {name} ---")
            print(f"Visibility (sheet_state): {ws.sheet_state}")
            print(f"Dimensions: max_row={ws.max_row}, max_column={ws.max_column}")
            print(f"Sheet views: {len(ws.views.sheetView)}")
            for idx, sv in enumerate(ws.views.sheetView):
                print(f"  View {idx}: topLeftCell={sv.topLeftCell}, showGridLines={sv.showGridLines}, zoomScale={sv.zoomScale}, tabSelected={sv.tabSelected}, view={sv.view}")
            
            # Check hidden rows/columns
            hidden_rows = [r for r, dim in ws.row_dimensions.items() if dim.hidden]
            hidden_cols = [c for c, dim in ws.column_dimensions.items() if dim.hidden]
            print(f"Hidden rows count: {len(hidden_rows)} (sample: {hidden_rows[:10]})")
            print(f"Hidden cols count: {len(hidden_cols)} (sample: {hidden_cols[:10]})")

            # Check sample cell contents and styling
            sample_cells = []
            non_empty_count = 0
            for r in range(1, min(ws.max_row + 1, 20)):
                for c in range(1, min(ws.max_column + 1, 20)):
                    val = ws.cell(r, c).value
                    if val is not None:
                        non_empty_count += 1
                        if len(sample_cells) < 10:
                            cell = ws.cell(r, c)
                            font_color = cell.font.color.rgb if cell.font and cell.font.color else "default"
                            sample_cells.append((cell.coordinate, val, font_color))
            print(f"Non-empty cells in top 20x20: {non_empty_count}")
            print(f"Sample cells: {sample_cells}")
    except Exception as e:
        print("Error loading workbook:", e)
