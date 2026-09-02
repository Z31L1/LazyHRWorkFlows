#!/bin/bash
sed -i '7345a\
              <label className="flex items-start gap-4 cursor-pointer p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition">\
                <div className="pt-0.5">\
                  <input\
                    type="checkbox"\
                    className="w-5 h-5 accent-red-500"\
                    checked={consent4}\
                    onChange={(e) => setConsent4(e.target.checked)}\
                  />\
                </div>\
                <div>\
                  <h4 className="text-sm font-bold text-slate-200 mb-1">\
                    Free API: KI-Trainingsdaten & Human Review\
                  </h4>\
                  <p className="text-xs text-slate-400">\
                    Mir ist bewusst, dass dieses System als Proof of Concept auf der kostenlosen Version der Google AI Studio API basiert. Ich stimme ausdrücklich zu, dass meine hochgeladenen Daten (inkl. aller potenziellen Klardaten) von Google für das Training zukünftiger KI-Modelle verwendet werden dürfen und potenziell von menschlichen Reviewern (Human Review) gelesen werden können.\
                  </p>\
                </div>\
              </label>' src/App.tsx
