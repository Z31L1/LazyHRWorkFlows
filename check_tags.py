import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# removing comments and strings is hard, let's just use a node script with a real parser, or just write a quick one.
