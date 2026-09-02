#!/bin/bash
sed -i 's/const \[consent3, setConsent3\] = useState(false);/const [consent3, setConsent3] = useState(false);\n  const [consent4, setConsent4] = useState(false);/' src/App.tsx
sed -i 's/setConsent3(false);/setConsent3(false);\n    setConsent4(false);/' src/App.tsx
sed -i 's/!consent1 || !consent2 || !consent3/!consent1 || !consent2 || !consent3 || !consent4/g' src/App.tsx
