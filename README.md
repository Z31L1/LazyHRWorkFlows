# LazyHRWorkFlows: Privacy-First Architecture Demonstrator

## Projekt-Fokus (Proof of Concept)
Dieses Projekt ist ein Proof of Concept (PoC) zur Evaluierung zustandsloser (stateless) LLM-Verarbeitung im HR-Kontext. Es demonstriert als Technologie-Studie, wie lokale Browser-APIs (Client-Side Pre-Processing) zur Vorverarbeitung von Dokumenten genutzt werden können, bevor strukturierte Datenflüsse an externe KI-Modelle weitergereicht werden.

**WICHTIG:** Dies ist keine einsatzbereite Enterprise-Software. Es handelt sich um einen Architektur-Demonstrator, der das Spannungsfeld zwischen LLM-Nutzung und "Privacy by Design" aufzeigt.

## Architektur & Datenschutz-Realität (Free-Tier Setup)
Aktuell nutzt dieses System die kostenlose Google AI Studio API zur Evaluierung der generativen Fähigkeiten. 
Da Free-Tier-APIs übertragene Daten standardmäßig für das Modell-Training verwenden und menschliche Reviews (Human Review) nicht ausgeschlossen sind, erzwingt die UI dieses Prototypen radikale Transparenz und Hard-Gates.

* **Das Pseudonymisierungs-Paradoxon:** Die implementierte Client-Side-Textextraktion (inkl. Namensschwärzung via Regex) stellt juristisch und technisch **keine Anonymisierung** dar, sondern lediglich eine Pseudonymisierung. Durch Kontextdaten (beruflicher Werdegang, seltene Jobtitel, spezifische Arbeitgeber) bleiben Betroffene theoretisch identifizierbar.
* **Expliziter Opt-In:** Die Übertragung von fehlerhaften oder unmaskierten PDFs wird durch einen expliziten Opt-In Consent für unmaskierten Dokumententransfer gemäß Art. 49 Abs. 1 lit. a DSGVO abgesichert. Der Nutzer muss den Drittlandtransfer (USA) und die Risiken des Modell-Trainings aktiv akzeptieren.

## Migrationspfad zum Enterprise-Betrieb
Die Codebase (`server.ts`) ist modular aufgebaut, um einen nahtlosen Übergang vom PoC in ein sicheres Produktionsumfeld zu ermöglichen. 
Für einen echten Produktivbetrieb ist ein Wechsel auf dedizierte Enterprise-Endpunkte zwingend erforderlich:
1. **Endpoint-Shift:** Umstellung auf Google Cloud Vertex AI in einer EU-Region (z.B. `europe-west3`).
2. **Rechtsrahmen:** Abschluss eines Auftragsverarbeitungsvertrags (AVV) inklusive EU-Standardvertragsklauseln (SCCs).
3. **Zero-Training-Garantie:** Nutzung von Enterprise-SLAs, die das Training von Foundation-Modellen mit Kundendaten vertraglich ausschließen.
