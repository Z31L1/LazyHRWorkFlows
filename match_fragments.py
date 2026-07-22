with open("src/App.tsx", "r") as f:
    lines = f.readlines()
stack = []
for i, line in enumerate(lines):
    idx = 0
    while idx < len(line):
        o = line.find("<>", idx)
        c = line.find("</>", idx)
        if o != -1 and (c == -1 or o < c):
            stack.append((i+1, o))
            idx = o + 2
        elif c != -1:
            if not stack:
                print(f"Error: unmatched </> at line {i+1}: {line.strip()}")
            else:
                start = stack.pop()
                print(f"Matched <> at {start[0]} with </> at {i+1}")
            idx = c + 3
        else:
            break
if stack:
    print("Unmatched <> at:", stack)
