# Agenten-Richtlinien für LazyHRWorkFlows

## WICHTIGSTE REGEL (STRENGSTENS VERPFLICHTEND)
- **Modell-Restriktion:** Verwende und ändere NIEMALS ein anderes Modell als **gemma-4-31b-it** (oder das jeweils vom Benutzer im Code konfigurierte Gemma-Modell) in `server.ts` oder an anderen Stellen der Anwendung.
- **Keine API-Änderungen:** Verändere niemals eigenmächtig die API-Kommunikationsroutinen, Modell-Fallbacks oder die strukturierte Anfrageaufbereitung für Gemma in `server.ts`. Jede unautorisierte Änderung an Modellen führt zu Kommunikationsfehlern mit der API.
- **Gemma-Struktur erhalten:** Gemma unterstützt keine strukturierten Ausgabeformate, Search Grounding, Thinking Budgets oder Systemanweisungen innerhalb der Konfiguration. Behalte die Bereinigungsfunktionen (wie `prepareGemmaRequest`) exakt so bei, wie sie sind.
- **Benutzerabsicht respektieren:** Der Code in `server.ts` ist fein abgestimmt auf die Vercel-Infrastruktur und die spezifische API-Kompatibilität von Gemma. Lass diesen Code unberührt, es sei denn, der Benutzer bittet dich explizit um eine Änderung.
