import openpyxl

for fname in ['data/(데이터검증팀)실사 DB 취합_전달용_260720_배현명.xlsx', 'data/배현명_실사DB_16컬럼_전수검증완료_최종본.xlsx']:
    wb = openpyxl.load_workbook(fname, read_only=True)
    for s in wb.sheetnames:
        print(repr(s))
    wb.close()
