import sys
try:
    import openpyxl
    print("openpyxl is installed!")
except ImportError:
    print("openpyxl is NOT installed.")

try:
    import pandas
    print("pandas is installed!")
except ImportError:
    print("pandas is NOT installed.")
