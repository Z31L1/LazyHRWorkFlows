sed -i 's/{redesignResult && (/{ (redesignResult || isManualSketchOpen) && (/g' src/App.tsx
sed -i 's/<div className={`${redesignResult ? "xl:col-span-2" : "xl:col-span-3"} space-y-6`}>/<div className={`${(redesignResult || isManualSketchOpen) ? "xl:col-span-2" : "xl:col-span-3"} space-y-6`}>/g' src/App.tsx
