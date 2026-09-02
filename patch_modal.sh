#!/bin/bash
# Insert the modal before the last two lines: "    </div>" and "  );"
sed -i '$ d' src/App.tsx
sed -i '$ d' src/App.tsx

cat << 'INNER_EOF' >> src/App.tsx

      {/* GDPR HARD-GATE MODAL */}
      {consentGateConfig && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl max-w-2xl w-full shadow-2xl shadow-red-900/20 flex flex-col max-h-screen overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-red-950/10">
              <div className="flex items-center gap-3 text-red-500 mb-2">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-bold">Sicherheitswarnung: Datenübertragung an US-KI-Server</h3>
              </div>
              <p className="text-sm text-slate-400">
                Sie sind dabei, die lokale Verarbeitung abzubrechen und Ihr Originaldokument (PDF) ungeschwärzt an die externe KI-Schnittstelle von Google (Gemini) zu senden. Dies birgt erhebliche datenschutzrechtliche Risiken.
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <label className="flex items-start gap-4 cursor-pointer p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                <div className="pt-0.5">
                  <input type="checkbox" className="w-5 h-5 accent-red-500" checked={consent1} onChange={(e) => setConsent1(e.target.checked)} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">Pseudonymisierungs-Paradoxon (Aufhebung der Maskierung)</h4>
                  <p className="text-xs text-slate-400">Mir ist bewusst, dass eine echte Anonymisierung meines Lebenslaufs unmöglich ist. Mein beruflicher Werdegang und meine Stationen machen mich eindeutig identifizierbar. Ich stimme zu, dass mein vollständiges Originaldokument ungeschwärzt verarbeitet wird.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                <div className="pt-0.5">
                  <input type="checkbox" className="w-5 h-5 accent-red-500" checked={consent2} onChange={(e) => setConsent2(e.target.checked)} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">Verarbeitung besonderer Datenkategorien (Art. 9 DSGVO)</h4>
                  <p className="text-xs text-slate-400">Ich willige explizit ein, dass potenziell hochsensible Daten (wie mein Foto, Konfession, Herkunft oder Gesundheitsdaten), die implizit im PDF enthalten sind, von der KI analysiert werden.</p>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                <div className="pt-0.5">
                  <input type="checkbox" className="w-5 h-5 accent-red-500" checked={consent3} onChange={(e) => setConsent3(e.target.checked)} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">Drittlandtransfer & Risiko (Art. 49 DSGVO)</h4>
                  <p className="text-xs text-slate-400">Ich akzeptiere das Risiko, dass meine ungeschwärzten Daten an Server in den USA (Google LLC) übertragen werden. Dort existiert kein der EU gleichwertiges Datenschutzniveau. US-Sicherheitsbehörden könnten theoretisch ohne Rechtsschutzmöglichkeiten auf diese Daten zugreifen.</p>
                </div>
              </label>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setConsentGateConfig(null)}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition"
              >
                Abbrechen (Sicherer Weg)
              </button>
              <button 
                onClick={executeDirectPdfBypass}
                disabled={!consent1 || !consent2 || !consent3}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700 border border-red-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                {!consent1 || !consent2 || !consent3 ? (
                  <>Bitte alle Risiken bestätigen</>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Auf eigenes Risiko senden
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
INNER_EOF
