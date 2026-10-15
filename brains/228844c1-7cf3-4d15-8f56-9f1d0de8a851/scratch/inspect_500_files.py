import openpyxl
import os

files = [
    'all_500_factchecked.tsv',
    'all_500_verified.tsv',
    'merged_500_perfect.tsv',
    'current_pasted_batch.tsv'
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            lines = [fp.readline().strip() for _ in range(5)]
            print(f"=== {f} ===")
            for l in lines:
                print(" ", l[:120])
