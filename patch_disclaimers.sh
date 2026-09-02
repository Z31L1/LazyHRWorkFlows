#!/bin/bash
DISCLAIMER='<div className="mb-4 p-3 bg-red-950/20 border border-red-900/30 rounded-xl text-[10px] text-red-300 leading-relaxed"><strong className="text-red-400 block mb-1">Datenschutz-Warnung (Free API PoC):</strong> Auch bei Namens-Maskierung können Ihre Daten durch den inhaltlichen Kontext (Werdegang) identifizierbar bleiben. Dieses System nutzt die kostenlose Google AI Studio API. <strong>Ihre Daten werden von Google für das KI-Training verwendet und potenziell durch menschliche Reviewer gelesen.</strong> Nutzen Sie keine sensiblen Klardaten.</div>'

# 1. ATS (Line 3908)
sed -i "3908i\                      $DISCLAIMER" src/App.tsx

# 2. Matching (Line 4272)
sed -i "4272i\                      $DISCLAIMER" src/App.tsx

# 3. Redesign (Line 4659)
sed -i "4659i\                          $DISCLAIMER" src/App.tsx

