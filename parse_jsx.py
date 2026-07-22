import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# very naive approach
stack = []
lines = code.split('\n')
for i, line in enumerate(lines):
    # just print line if error
    pass
