import os, openpyxl

terms = ["THE5", "the5", "musicSHEET", "musicsheet", "오희섭", "517-8828", "5178828"]
dirpath = r"C:\Users\lg\Desktop\오늘"

files = [
    r"C:\Users\lg\Desktop\오늘\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_최종.xlsx",
    r"C:\Users\lg\Desktop\오늘\(안상숙)(STI)_(모집단현행화)_부산정보산업진흥원_2026_부산_CT산업_실태조사_260910_크레탑_배현명_.xlsx",
    r"C:\Users\lg\Desktop\오늘\사업자번호_찾은_192개.xlsx",
    r"C:\Users\lg\Desktop\오늘\사업자번호_찾은_192개_매출액포함.xlsx",
    r"C:\Users\lg\Desktop\오늘\인공지능으로찾은거.xlsx",
    r"C:\Users\lg\Desktop\오늘\인공지능으로찾을거.xlsx",
]

for f in files:
    if not os.path.exists(f):
        continue
    wb = openpyxl.load_workbook(f, read_only=True, data_only=True)
    for sname in wb.sheetnames:
        ws = wb[sname]
        for row_idx, row in enumerate(ws.iter_rows(values_only=True), 1):
            row_str = " | ".join([str(c) for c in row if c is not None])
            for t in terms:
                if t.lower() in row_str.lower():
                    print(f"[{os.path.basename(f)} : {sname} R{row_idx}] ({t}) -> {row_str}")
                    break
    wb.close()
