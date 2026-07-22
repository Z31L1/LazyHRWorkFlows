import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines[4630:4655]):
    print(f"{4631 + i}: {line}", end='')
