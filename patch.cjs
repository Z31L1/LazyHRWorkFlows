const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `<div className="xl:col-span-1 space-y-4 flex flex-col justify-start">
                          {isManualSketchOpen ? (
                             <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                                  <div>
                                    <span className="text-xs text-yellow-400 font-bold uppercase tracking-wider block">Skizzen Werkzeuge & Optionen</span>
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">Farben, Stifte und KI-Anweisungen</span>
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-4">
                                  <div className="w-full max-w-[420px] flex flex-col gap-2 mt-2 bg-slate-950 border border-slate-900 p-3 rounded-xl">
                                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block border-b border-slate-800 pb-1">KI Farbbedeutung / Legende:</span>
                                    <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#2563EB")}
                                        className={\`p-2 rounded-lg border text-left flex items-center gap-2 transition \${sketchColor === "#2563EB" ? "bg-blue-600/20 border-blue-500 text-blue-300" : "bg-slate-900 border-slate-850 text-slate-400"}\`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-blue-600 block shrink-0" />
                                        Blau: Kontaktdaten
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#FACC15")}
                                        className={\`p-2 rounded-lg border text-left flex items-center gap-2 transition \${sketchColor === "#FACC15" ? "bg-yellow-500/25 border-yellow-500 text-yellow-350" : "bg-slate-900 border-slate-850 text-slate-400"}\`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-yellow-400 block shrink-0" />
                                        Gelb: Fähigkeiten
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#EF4444")}
                                        className={\`p-2 rounded-lg border text-left flex items-center gap-2 transition \${sketchColor === "#EF4444" ? "bg-red-500/20 border-red-500 text-red-300" : "bg-slate-900 border-slate-850 text-slate-400"}\`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-red-500 block shrink-0" />
                                        Rot: Erfahrung
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#000000")}
                                        className={\`p-2 rounded-lg border text-left flex items-center gap-2 transition \${sketchColor === "#000000" ? "bg-slate-800 border-slate-650 text-white" : "bg-slate-900 border-slate-850 text-slate-400"}\`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-black border border-slate-600 block shrink-0" />
                                        Schwarz: Foto/Bild
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#22C55E")}
                                        className={\`p-2 rounded-lg border text-left flex items-center gap-2 transition \${sketchColor === "#22C55E" ? "bg-green-500/20 border-green-500 text-green-300" : "bg-slate-900 border-slate-850 text-slate-400"}\`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-green-500 block shrink-0" />
                                        Grün: Ausbildung
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("#A855F7")}
                                        className={\`p-2 rounded-lg border text-left flex items-center gap-2 transition \${sketchColor === "#A855F7" ? "bg-purple-500/20 border-purple-500 text-purple-300" : "bg-slate-900 border-slate-850 text-slate-400"}\`}
                                      >
                                        <span className="w-3 h-3 rounded-full bg-purple-500 block shrink-0" />
                                        Lila: Style-Aufteilung
                                      </button>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex justify-between items-center gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => setSketchColor("eraser")}
                                        className={\`px-2.5 py-1 text-[9px] font-extrabold rounded-lg border transition \${sketchColor === "eraser" ? "bg-purple-600/30 border-purple-500 text-purple-300" : "bg-slate-900 border-slate-850 text-slate-400"}\`}
                                      >
                                        🧹 Radierer
                                      </button>
                                      <button
                                        type="button"
                                        onClick={clearSketchCanvas}
                                        className="px-2.5 py-1 text-[9px] bg-slate-900 hover:bg-slate-850 text-slate-300 font-extrabold rounded-lg border border-slate-800 transition"
                                      >
                                        Leeren
                                      </button>
                                    </div>
                                    {/* Brush size choice */}
                                    <div className="flex items-center justify-between text-[9px] font-medium pt-1">
                                      <span className="text-slate-400">Pinselstärke:</span>
                                      <div className="flex gap-1.5">
                                        {[6, 12, 24].map((size) => (
                                          <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSketchBrushSize(size)}
                                            className={\`px-2 py-0.5 rounded text-[8px] font-bold \${sketchBrushSize === size ? "bg-yellow-500 text-slate-950 font-extrabold" : "bg-slate-900 text-slate-400 hover:text-slate-200"}\`}
                                          >
                                            {size === 6 ? "Dünn" : size === 12 ? "Mittel" : "Dick"}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    {/* AI Layout use checkbox */}
                                    <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-850/60 select-none">
                                      <input
                                        type="checkbox"
                                        checked={useSketchInAi}
                                        onChange={(e) => setUseSketchInAi(e.target.checked)}
                                        className="rounded border-slate-800 bg-slate-950 text-yellow-500 focus:ring-0 h-3.5 w-3.5"
                                      />
                                      <span className="text-[10px] text-slate-300 font-bold">
                                        Layoutvorlage für KI aktivieren
                                      </span>
                                    </label>
                                    {/* Advanced Options for Sketch */}
                                    {useSketchInAi && (
                                      <div className="space-y-3 pt-2 border-t border-slate-850/60">
                                        {/* Sketch Mode Toggle */}
                                        <div className="flex flex-col gap-1.5">
                                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Zeichenmodus / KI-Interpretation:</span>
                                          <div className="flex gap-2">
                                            <button
                                              type="button"
                                              onClick={() => setSketchMode("grid")}
                                              className={\`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold border transition \${sketchMode === "grid" ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"}\`}
                                            >
                                              Raster / Linear
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setSketchMode("freehand")}
                                              className={\`flex-1 py-1 px-2 rounded-lg text-[9px] font-bold border transition \${sketchMode === "freehand" ? "bg-amber-600/20 border-amber-500 text-amber-400" : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"}\`}
                                            >
                                              Freihand (1:1 Skizze folgen)
                                            </button>
                                          </div>
                                        </div>
                                        {/* Advanced Custom Prompt Input */}
                                        <div className="flex flex-col gap-1.5">
                                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block flex items-center gap-1"><Settings className="h-3 w-3" /> Advanced: Eigene Anweisung (Style)</span>
                                          <textarea
                                            value={sketchPrompt}
                                            onChange={(e) => setSketchPrompt(e.target.value)}
                                            placeholder="Bsp.: Die Style Aufteilung sind Äste von Pflanzen mit Blättern am Ende..."
                                            className="w-full h-16 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 placeholder:text-slate-600 p-2 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors resize-none"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                             </div>
                          ) : (
                             <>`;

code = code.replace('<div className="xl:col-span-1 space-y-4 flex flex-col justify-start">', replacement);
fs.writeFileSync('src/App.tsx', code);
