#!/bin/bash
# Remove line 5506 (the closing div)
sed -i '5506d' src/App.tsx

# Append the closing div right before the ");"
sed -i '/  );/i \    </div>' src/App.tsx
