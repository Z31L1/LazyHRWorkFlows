const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

for (let i = 4638; i < 4648; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

// I will just replace the problematic lines
lines[4641] = "                  </div>"; // close code editor
lines[4642] = "                  </>"; // close fragment
lines[4643] = "                  )}"; // close ternary
lines[4644] = "                </div>"; // close xl:col-span-1
lines[4645] = "                )}"; // close redesignResult || isManualSketchOpen

fs.writeFileSync('src/App.tsx', lines.join('\n'));
