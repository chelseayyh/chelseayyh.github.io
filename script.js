// Smooth in-page navigation
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();


 

document.addEventListener("DOMContentLoaded", () => {
  // === LOAD JSON UTILITY ===
  function loadJSON(url, callback) {
    fetch(url)
      .then(res => res.json())
      .then(callback)
      .catch(err => console.error("Error loading", url, err));
  }

document.querySelectorAll('.abstract').forEach(abs => {
  const btn = abs.nextElementSibling;
  if (!btn || !btn.classList.contains('abstract-toggle')) return;

  function updateButtonVisibility() {
    // Show the button only if abstract is actually longer than clamp
    if (abs.classList.contains('expanded')) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.toggle('hidden', !(abs.scrollHeight > abs.clientHeight + 1));
    }
  }

  btn.addEventListener('click', () => {
    const expanded = abs.classList.toggle('expanded');
    btn.setAttribute('aria-expanded', expanded);
    btn.textContent = expanded ? 'Show less' : 'Read more';
    requestAnimationFrame(updateButtonVisibility);
  });

  updateButtonVisibility();
});


// === PUBLICATION LISTS ===
  function populateRefList(id, file, type) {
    const container = document.getElementById(id);
    if (!container) return;

    loadJSON(file, refs => {
      refs.forEach((ref, i) => {
        let entry = "";
        let prefix = "";

        if (type === "preprint") {
          prefix = ``;
          entry = `${prefix} ${ref.authors}, “<a href="${ref.link}" target="_blank">${ref.title}</a>,” ${ref.preprint}</i>.`;
        } 
        else if (type === "journal") {
          prefix = `[J${refs.length-i}]`;
          if (ref.type === "early_access"){
            entry = `${prefix} ${ref.authors}, “<a href="${ref.link}" target="_blank">${ref.title}</a>,” <i>${ref.journal}</i>, ${ref.year}, DOI:${ref.doi}.`;
          }
          else {
            entry = `${prefix} ${ref.authors}, “<a href="${ref.link}" target="_blank">${ref.title}</a>,” <i>${ref.journal}</i>, vol. ${ref.volume}, no. ${ref.number}, pp. ${ref.pages}, ${ref.year}, DOI:${ref.doi}.`;
          }
        } 
        else if (type === "conference") {
          prefix = `[C${refs.length-i}]`;
          entry = `${prefix} ${ref.authors}, “<a href="${ref.link}" target="_blank">${ref.title}</a>,” in <i>${ref.conference}</i>, ${ref.place}, DOI:${ref.doi}.`;
        }

        const li = document.createElement("li");
        li.innerHTML = entry;
        container.appendChild(li);
      });
    });
  }

  populateRefList("preprints-list", "data/preprints.json", "preprint");
  populateRefList("journals-list", "data/journals.json", "journal");
  populateRefList("conferences-list", "data/conferences.json", "conference");
});


