/* KTS Advisory - privacy choices for optional Google Maps (no third-party call before consent). */
(function () {
  "use strict";
  var KEY = "kts_optional_services_v1";
  var MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
  var choices = null;
  var banner, panel, toggle;
  var I18N = {
    it: {
      title: "Preferenze per i servizi esterni",
      description: "Il sito usa funzionalità tecniche necessarie. La mappa di Google nella pagina Contatti viene caricata solo con il tuo consenso e può trasmettere dati a Google.",
      reject: "Rifiuta",
      accept: "Accetta",
      customize: "Personalizza",
      close: "Chiudi senza accettare",
      settings: "Gestisci cookie",
      settingsTitle: "Impostazioni privacy",
      required: "Funzionalità necessarie (sempre attive)",
      optional: "Google Maps (facoltativo)",
      optionalDescription: "Visualizzazione della mappa nella pagina Contatti; il caricamento può comportare cookie e trattamenti da parte di Google.",
      save: "Salva preferenze",
      policies: "Informativa cookie",
      mapTitle: "Mappa disattivata",
      mapDescription: "Per proteggere la tua privacy, Google Maps non viene caricato automaticamente.",
      mapActivate: "Attiva Google Maps"
    },
    en: {
      title: "External service preferences",
      description: "The website uses essential technical features. Google Maps on the Contact page loads only with your consent and may transmit data to Google.",
      reject: "Reject",
      accept: "Accept",
      customize: "Customize",
      close: "Close without accepting",
      settings: "Cookie settings",
      settingsTitle: "Privacy settings",
      required: "Essential functions (always enabled)",
      optional: "Google Maps (optional)",
      optionalDescription: "Displays the map on the Contact page; loading it may involve cookies and processing by Google.",
      save: "Save choices",
      policies: "Cookie policy",
      mapTitle: "Map disabled",
      mapDescription: "Google Maps is not loaded automatically to protect your privacy.",
      mapActivate: "Enable Google Maps"
    }
  };
  function language() {
    return document.documentElement.lang === "en" ? "en" : "it";
  }
  function tr(key) { return I18N[language()][key]; }
  function read() {
    try {
      var value = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!value || typeof value.maps !== "boolean" || !Number.isFinite(value.savedAt)) return null;
      if (Date.now() - value.savedAt > MAX_AGE_MS || value.savedAt > Date.now()) return null;
      return value;
    } catch (e) { return null; }
  }
  function store(maps) {
    choices = { maps: !!maps, savedAt: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(choices)); } catch (e) { /* session-only preference */ }
    syncMap();
    banner.hidden = true;
    panel.hidden = true;
  }
  function syncMap() {
    var frame = document.querySelector("[data-kts-map-src]");
    var placeholder = document.getElementById("kts-map-placeholder");
    if (!frame || !placeholder) return;
    var allowed = !!(choices && choices.maps);
    if (allowed) {
      if (!frame.getAttribute("src")) frame.setAttribute("src", frame.getAttribute("data-kts-map-src"));
      frame.hidden = false;
      frame.style.display = "block";
      placeholder.hidden = true;
    } else {
      frame.removeAttribute("src");
      frame.hidden = true;
      frame.style.display = "none";
      placeholder.hidden = false;
    }
  }
  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }
  function button(name, key, fn) {
    var el = node("button", "kts-cookie-btn " + name, tr(key));
    el.type = "button";
    el.addEventListener("click", fn);
    el.setAttribute("data-kts-label", key);
    return el;
  }
  function openPreferences() {
    var check = document.getElementById("kts-maps-choice");
    check.checked = !!(choices && choices.maps);
    banner.hidden = true;
    panel.hidden = false;
    check.focus();
  }
  function closePreferences() {
    panel.hidden = true;
    banner.hidden = !!choices;
  }
  function updateLabels() {
    document.querySelectorAll("[data-kts-label]").forEach(function(el) {
      el.textContent = tr(el.getAttribute("data-kts-label"));
    });
  }
  function init() {
    choices = read();
    banner = node("section", "kts-cookie-banner");
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Privacy preferences");
    banner.innerHTML = '<div class="kts-cookie-header"><strong data-kts-label="title"></strong></div>' +
      '<p data-kts-label="description"></p>' +
      '<div class="kts-cookie-actions" id="kts-cookie-actions"></div>' +
      '<a href="cookie-policy.html" data-kts-label="policies"></a>';
    var actions = banner.querySelector("#kts-cookie-actions");
    actions.appendChild(button("secondary", "reject", function () { store(false); }));
    actions.appendChild(button("secondary", "customize", openPreferences));
    actions.appendChild(button("primary", "accept", function () { store(true); }));
    document.body.appendChild(banner);

    panel = node("section", "kts-cookie-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "Privacy settings");
    panel.innerHTML = '<div class="kts-cookie-header"><strong data-kts-label="settingsTitle"></strong></div>' +
      '<p data-kts-label="required"></p>' +
      '<label class="kts-cookie-choice"><input type="checkbox" id="kts-maps-choice">' +
      '<span><strong data-kts-label="optional"></strong><small data-kts-label="optionalDescription"></small></span></label>' +
      '<div class="kts-cookie-actions" id="kts-cookie-save-actions"></div>';
    var saveActions = panel.querySelector("#kts-cookie-save-actions");
    saveActions.appendChild(button("secondary", "close", closePreferences));
    saveActions.appendChild(button("primary", "save", function () {
      store(!!document.getElementById("kts-maps-choice").checked);
    }));
    document.body.appendChild(panel);
    banner.hidden = !!choices;
    panel.hidden = true;

    toggle = button("link", "settings", openPreferences);
    toggle.classList.add("kts-cookie-manage");
    var footer = document.querySelector(".footer-policy, footer");
    if (footer) footer.appendChild(toggle);
    var mapActivate = document.getElementById("kts-map-activate");
    if (mapActivate) mapActivate.addEventListener("click", function () { store(true); });
    syncMap();
    updateLabels();

    document.querySelectorAll("[data-lang-switch]").forEach(function(el) {
      el.addEventListener("click", updateLabels);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();