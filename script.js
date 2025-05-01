// Last inn XML-filen når siden lastes
let xmlDoc = null;
fetch('dictionary.xml')
  .then(response => response.text())
  .then(xmlText => {
      // Parse XML-tekst til et XML DOM-dokument
      const parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlText, "text/xml");
  })
  .catch(err => console.error("Feil ved lasting av XML:", err));

// Søke-funksjon koblet til input-feltet
function searchWord() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";  // tøm tidligere resultater

    if (!xmlDoc || query === "") {
        // XML ikke lastet enda, eller tomt søk
        return;
    }
    // Hent alle <entry>-elementer fra XML
    const entries = xmlDoc.getElementsByTagName("entry");
    let matchCount = 0;
    for (let entry of entries) {
        // Hent spansk ord (antar kun ett <spanish> per entry)
        const spanishWord = entry.getElementsByTagName("spanish")[0].textContent.toLowerCase();
        if (spanishWord.startsWith(query)) {
            matchCount++;
            // Hent datafelt fra XML for å vise
            const norwegian = entry.getElementsByTagName("norwegian")[0]?.textContent || "";
            const pos = entry.getElementsByTagName("pos")[0]?.textContent || "";
            const gender = entry.getElementsByTagName("gender")[0]?.textContent || "";
            const definition = entry.getElementsByTagName("definition")[0]?.textContent || "";
            const tags = entry.getElementsByTagName("tags")[0]?.textContent || "";

            // Bygg HTML for bøyninger og eksempler
            let inflectionsText = "";
            const inflNodes = entry.getElementsByTagName("inflections");
            if (inflNodes.length > 0) {
                const infl = inflNodes[0]; // <inflections>
                // Lag en kommaseparert liste av alle bøyningsformer (tag-navn: verdi)
                const children = infl.children;
                const forms = [];
                for (let child of children) {
                    forms.push(`${child.tagName}: ${child.textContent}`);
                }
                inflectionsText = forms.join(", ");
            }

            let examplesText = "";
            const exampleNodes = entry.getElementsByTagName("example");
            if (exampleNodes.length > 0) {
                // Tar kun første eksempel for korthet
                const ex = exampleNodes[0];
                const exEs = ex.getElementsByTagName("spanish")[0]?.textContent || "";
                const exNo = ex.getElementsByTagName("norwegian")[0]?.textContent || "";
                examplesText = `<div><em>Eksempel:</em> «${exEs}» – ${exNo}</div>`;
            }

            // Sett sammen HTML for denne oppføringen
            resultsDiv.innerHTML += `
                <div class="entry">
                    <h3>${spanishWord} – ${norwegian}</h3>
                    <p>${pos}${gender ? " (" + gender + ")" : ""}${definition ? ": " + definition : ""}</p>
                    ${inflectionsText ? `<p class="inflection">Bøyninger: ${inflectionsText}</p>` : ""}
                    <!-- ${tags ? `<p class="tags">Tagger: ${tags}</p>` : ""} -->
                    ${examplesText ? examplesText : ""}
                </div>`;
        }
    }
    if (matchCount === 0) {
        resultsDiv.innerHTML = "<p><em>Ingen treff.</em></p>";
    }
}
