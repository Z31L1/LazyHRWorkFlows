with open("src/App.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for i in range(4649):
    new_lines.append(lines[i])

new_lines.append("""
            {/* Common informational footer */}
            <div className="border-t border-slate-800/80 pt-4 mt-6 flex items-center justify-between text-[10px] text-slate-500">
              <span>System: <strong>AI-Bridge Privacy Suite v1.4</strong></span>
              <span>Lokalzeit: {new Date().toLocaleDateString("de-DE")}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/50 py-6 mt-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            © 2026 Lazy-HR-Workaround. Intelligente Automatisierung für deinen Bewerbungserfolg.
          </div>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>Powered by <strong>Gemma-4</strong></span>
            <span>•</span>
            <span>Keine Speicherung von Profilen auf Cloud-Servern</span>
          </div>
        </div>
      </footer>

      {isRedesignFullscreen && redesignResult && (
        <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-50 flex flex-col p-4 sm:p-6 overflow-hidden">
          {/* Fullscreen Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Vollbild-Vorschau</h3>
            <button
              type="button"
              onClick={() => setIsRedesignFullscreen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
            >
              Schließen
            </button>
          </div>
          <div className="flex-1 bg-white rounded-xl overflow-hidden relative">
            <iframe
              title="Fullscreen Document Preview"
              srcDoc={
                redesignSelectedDoc === "resume"
                  ? redesignResult[redesignSelectedStyle]?.resume?.html
                  : redesignResult[redesignSelectedStyle]?.cover_letter?.html
              }
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
""")

with open("src/App.tsx", "w") as f:
    f.writelines(new_lines)
