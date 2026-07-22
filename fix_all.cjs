const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

const startIndex = 4639; // the line with `</div>` for DSGVO Footer.
const replacements = [
  "                  </>",
  "                  )}",
  "                </div>",
  "                )}",
  "              </div>",
  "            </div>",
  "            )}",
  "          </div>",
  "        )}"
];

let i = 0;
while (i < replacements.length) {
  lines[startIndex + i + 1] = replacements[i];
  i++;
}

// remove anything else until "Common informational footer"
let curr = startIndex + i + 1;
while (curr < lines.length && !lines[curr].includes("Common informational footer")) {
  lines[curr] = ""; // clear it out
  curr++;
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
