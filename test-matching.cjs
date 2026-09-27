async function run() {
  const combinedContent =
    `--- REPORT FÜR ATS VERGLEICH ---\n\n` +
    `[Bewerber Lebenslauf]\nMax Mustermann\nSoftwareentwickler mit 5 Jahren Erfahrung in React, TypeScript und Node.js.\n\n` +
    `[Ziel-Stellenausschreibung]\nSenior Frontend Entwickler gesucht bei TechCorp GmbH in Berlin. Anforderungen: React, TypeScript, TailwindCSS.`;

  console.log("Sending request to /api/process-resume with mode=matching...");
  const t0 = Date.now();
  try {
    const res = await fetch("http://localhost:3000/api/process-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: combinedContent,
        mode: "matching",
        model: "gemma-4-31b-it"
      })
    });
    console.log(`Status: ${res.status} in ${Date.now() - t0}ms`);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
run();
