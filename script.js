
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const resultsDiv = document.getElementById("results");

  fetch("dictionary.xml")
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "application/xml");
      const entries = xmlDoc.getElementsByTagName("entry");
    console.log("Antall oppslag:", entries.length);
      searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim().toLowerCase();
        const strippedQuery = query.startsWith("å ") ? query.slice(2) : query;

        resultsDiv.innerHTML = "";

        Array.from(entries).forEach((entry) => {
          const spanishWord = entry.getElementsByTagName("spanish")[0].textContent.toLowerCase();
          const norwegianWord = entry.getElementsByTagName("norwegian")[0].textContent.toLowerCase();
          const pos = entry.getElementsByTagName("pos")[0]?.textContent.toLowerCase() || "";
          const tags = entry.getElementsByTagName("tags")[0]?.textContent.toLowerCase() || "";
          const regular = entry.getElementsByTagName("regular")[0]?.textContent.toLowerCase() || "";
          const gender = entry.getElementsByTagName("gender")[0]?.textContent.toLowerCase() || "";

          const match =
            spanishWord.includes(query) ||
            norwegianWord.includes(query) ||
            norwegianWord.includes(strippedQuery);

          if (match) {
            const inflections = entry.getElementsByTagName("inflections")[0];
            let inflectionsText = "";

            if (pos === "verb" && inflections) {
              const children = inflections.getElementsByTagName("*");
              const forms = [];
              for (let child of children) {
                forms.push(`<strong>${visNavn(child.tagName)}:</strong> ${child.textContent}`);
              }
              inflectionsText = forms.join("<br>");
            }

            const norwegianDisplay =
              pos === "verb"
                ? "å " + entry.getElementsByTagName("norwegian")[0].textContent + (regular === "false" ? " (irreg.)" : " (reg.)")
                : entry.getElementsByTagName("norwegian")[0].textContent;

            const spanishDisplay =
              pos === "substantiv"
                ? (gender === "m" ? "el " : gender === "f" ? "la " : "") + entry.getElementsByTagName("spanish")[0].textContent
                : entry.getElementsByTagName("spanish")[0].textContent;

            const tagList = tags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t)
              .map((t) => `<span class="tag">${t}</span>`)
              .join(" ");

            const resultHTML = `
              <div class="result">
                <h3>${spanishDisplay} – ${norwegianDisplay}</h3>
                ${inflectionsText ? `<p class="inflection">${inflectionsText}</p>` : ""}
                ${tagList ? `<p class="tags">${tagList}</p>` : ""}
              </div>
            `;

            resultsDiv.innerHTML += resultHTML;
          }
        });
      });
    });

  function visNavn(tag) {
    const navn = {
      presens: "Presens",
      preteritum: "Preteritum",
      perfektum: "Perfektum",
      partisipp: "Perfektum partisipp",
      gerundium: "Gerundium",
      imperfektum: "Imperfektum",
      futurum: "Futurum",
      imperativ: "Imperativ",
    };
    return navn[tag] || tag;
  }
});
