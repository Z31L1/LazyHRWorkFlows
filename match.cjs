const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = '<div className="xl:col-span-1 space-y-4 flex flex-col justify-start">';
const startIdx = code.indexOf(startStr);
if (startIdx === -1) {
  console.log("Not found");
  process.exit(1);
}

let depth = 0;
let endIdx = -1;
let i = startIdx;
while (i < code.length) {
  if (code.startsWith('<div', i)) {
    depth++;
    i += 4;
  } else if (code.startsWith('</div', i)) {
    depth--;
    if (depth === 0) {
      endIdx = i;
      break;
    }
    i += 5;
  } else {
    i++;
  }
}

console.log("endIdx:", endIdx);
console.log("Lines around endIdx:");
console.log(code.substring(endIdx - 100, endIdx + 100));

const newCode = code.substring(0, endIdx) + '</>\n)}' + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', newCode);
