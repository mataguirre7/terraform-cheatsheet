/* ==========================================================
   Terraform Cheatsheets — comportamiento del sitio
   - barra de navegación
   - resaltado de sintaxis (sh / hcl / yaml / dockerfile)
   - botón copiar en cada bloque de código
   - buscador (filtra tarjetas)
   - tema claro / oscuro
   ========================================================== */

(function () {
  const SITE = {
    title: "Terraform Cheatsheets",
    icon: "tf",
    // Sitio hermano: pegá la URL de Netlify de otra colección de cheatsheets
    // (ej. "https://docker-cheatsheets.netlify.app/"). Vacío = botón oculto.
    other: { label: "Docker", href: "", icon: "whale" },
    pages: [
      { id: "inicio",     href: "index.html",                 label: "Inicio" },
      { id: "empezar",    href: "00-empezar.html",            label: "Empezar" },
      { id: "conceptos",  href: "01-conceptos.html",          label: "Conceptos" },
      { id: "cli",        href: "02-cli.html",                label: "CLI" },
      { id: "hcl",        href: "03-lenguaje-hcl.html",       label: "Lenguaje HCL" },
      { id: "vars-state", href: "04-variables-estado.html",   label: "Variables y estado" },
      { id: "modulos",    href: "05-modulos-proyecto.html",   label: "Módulos y proyecto" },
      { id: "practica",   href: "06-practica-docker.html",    label: "Práctica con Docker" },
      { id: "problemas",  href: "07-problemas.html",          label: "Problemas comunes" },
    ],
  };

  const ICONS = {
    whale: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="4" width="56" height="56" rx="14" fill="#1d63ed"/><g fill="#fff"><rect x="14" y="27" width="7" height="6" rx="1"/><rect x="22" y="27" width="7" height="6" rx="1"/><rect x="30" y="27" width="7" height="6" rx="1"/><rect x="22" y="20" width="7" height="6" rx="1"/><rect x="30" y="20" width="7" height="6" rx="1"/><rect x="30" y="13" width="7" height="6" rx="1"/><rect x="38" y="27" width="7" height="6" rx="1"/><path d="M10 35h38c2-1 3-4 3-6 2 0 4 1 5 2-1 2-3 3-5 3-3 9-12 16-25 16-9 0-14-5-16-15z"/></g></svg>',
    helm: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="4" width="56" height="56" rx="14" fill="#326ce5"/><g fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"><circle cx="32" cy="32" r="10.5"/><path d="M32 13v8.5M32 42.5V51M13 32h8.5M42.5 32H51M18.6 18.6l6 6M39.4 39.4l6 6M18.6 45.4l6-6M39.4 24.6l6-6"/></g><circle cx="32" cy="32" r="3.6" fill="#fff"/></svg>',
    tf: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="4" width="56" height="56" rx="14" fill="#7b42bc"/><g fill="#fff"><path d="M14 13l10 5.8v11.6l-10-5.8z"/><path d="M26 20.4l10 5.8v11.6l-10-5.8z"/><path d="M26 34.2l10 5.8v11.6l-10-5.8z"/><path d="M38 26.2l10-5.8v11.6l-10 5.8z" opacity=".7"/></g></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  };

  /* ---------- tema ---------- */

  const root = document.documentElement;
  function storedTheme() {
    try { return localStorage.getItem("dcs-theme"); } catch (e) { return null; }
  }
  function saveTheme(t) {
    try { localStorage.setItem("dcs-theme", t); } catch (e) { /* sin storage */ }
  }
  // ?theme=dark|light fuerza el tema (útil para exportar imágenes)
  const forced = new URLSearchParams(location.search).get("theme");
  const initial = forced === "dark" || forced === "light" ? forced : storedTheme();
  if (initial) root.setAttribute("data-theme", initial);

  function isDark() {
    const t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  /* ---------- barra superior ---------- */

  function buildTopbar() {
    const bar = document.querySelector("header.topbar");
    if (!bar) return;
    const current = document.body.dataset.page;
    const links = SITE.pages.map(p =>
      `<a href="${p.href}"${p.id === current ? ' class="active" aria-current="page"' : ""}>${p.label}</a>`
    ).join("");
    const other = SITE.other.href
      ? `<a class="set-switch" href="${SITE.other.href}" title="Ir a las cheatsheets de ${SITE.other.label}">${ICONS[SITE.other.icon]}<span>${SITE.other.label}</span></a>`
      : "";
    bar.innerHTML =
      `<div class="topbar-inner">
        <a class="brand" href="index.html">${ICONS[SITE.icon]}<span>${SITE.title}</span></a>
        <nav class="nav" aria-label="Cheatsheets">${links}</nav>
        ${other}
        <button class="icon-btn" id="themeBtn" type="button" title="Cambiar tema"></button>
      </div>`;
    const btn = document.getElementById("themeBtn");
    const paint = () => { btn.innerHTML = isDark() ? ICONS.sun : ICONS.moon; };
    paint();
    btn.addEventListener("click", () => {
      const next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      saveTheme(next);
      paint();
    });
    const active = bar.querySelector(".nav a.active");
    if (active) active.scrollIntoView({ block: "nearest", inline: "center" });
  }

  /* ---------- resaltado ---------- */

  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const RULES = {
    sh: [
      [/(?:^|(?<=\s))#.*$/gm, "cm"],
      [/"[^"\n]*"|'[^'\n]*'/g, "st"],
      [/<[^<>\s][^<>\n]*?>/g, "ph"],
      [/(?<![\w.\/-])(?:terraform|tofu|winget|aws|az|docker|compose|npm|node|curl|git|kubectl)(?![\w.:\/=-])/g, "kw"],
      [/(?:^|(?<=\s))--?[A-Za-z][\w-]*(?:=\S+)?/gm, "fl"],
    ],
    yaml: [
      [/(?:^|(?<=\s))#.*$/gm, "cm"],
      [/^[ \t]*(?:- )?[\w.$-]+(?=:(?:\s|$))/gm, "key"],
      [/"[^"\n]*"|'[^'\n]*'/g, "st"],
      [/<[^<>\s][^<>\n]*?>/g, "ph"],
      [/\$\{[^}]+\}/g, "ph"],
    ],
    dockerfile: [
      [/(?:^|(?<=\s))#.*$/gm, "cm"],
      [/^[ \t]*(?:FROM|RUN|COPY|ADD|WORKDIR|EXPOSE|CMD|ENTRYPOINT|ENV|ARG|USER|LABEL|VOLUME|HEALTHCHECK|SHELL)\b/gm, "kw"],
      [/\bAS\b/g, "kw"],
      [/"[^"\n]*"/g, "st"],
      [/<[^<>\s][^<>\n]*?>/g, "ph"],
      [/(?:^|(?<=\s))--[\w-]+(?:=\S+)?/gm, "fl"],
    ],
    hcl: [
      [/\/\*[\s\S]*?\*\//g, "cm"],
      [/(?:^|(?<=\s))(?:#|\/\/).*$/gm, "cm"],
      [/<[^<>\s"][^<>\n"]*?>/g, "ph"],
      [/\$\{[^}\n]*\}/g, "sub"],
      [/"(?:[^"\\\n]|\\.)*"/g, "st"],
      [/^[ \t]*(?:terraform|provider|resource|data|variable|output|locals|module|backend|required_providers|moved|import|removed|check|dynamic|content|lifecycle|provisioner|cloud|validation|precondition|postcondition|build|ports|volumes|networks_advanced)\b(?=\s*[{"])/gm, "kw"],
      [/^[ \t]*[\w-]+(?=\s*=(?!=))/gm, "key"],
      [/\b(?:true|false|null)\b/g, "num"],
      [/(?<![\w.])\d+(?:\.\d+)?\b/g, "num"],
      [/\b(?:var|local|data|module|each|count|path|self)\.(?=\w)/g, "sub"],
    ],
    plain: [
      [/(?:^|(?<=\s))#.*$/gm, "cm"],
      [/<[^<>\s][^<>\n]*?>/g, "ph"],
    ],
  };

  function highlight(text, lang) {
    const rules = RULES[lang] || RULES.plain;
    // marca cada caracter con el primer token que lo reclama (por orden de prioridad)
    const owner = new Array(text.length).fill(null);
    for (const [re, cls] of rules) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        if (m[0].length === 0) { re.lastIndex++; continue; }
        const start = m.index, end = m.index + m[0].length;
        let free = true;
        for (let i = start; i < end; i++) if (owner[i]) { free = false; break; }
        if (!free) continue;
        for (let i = start; i < end; i++) owner[i] = cls;
      }
    }
    let out = "", i = 0;
    while (i < text.length) {
      const cls = owner[i];
      let j = i;
      while (j < text.length && owner[j] === cls) j++;
      const chunk = esc(text.slice(i, j));
      out += cls ? `<span class="tk-${cls}">${chunk}</span>` : chunk;
      i = j;
    }
    return out;
  }

  function enhanceCode() {
    document.querySelectorAll("pre > code").forEach(code => {
      const raw = code.textContent.replace(/^\n/, "").replace(/\s+$/, "");
      const lang = code.dataset.lang || code.parentElement.dataset.lang || "sh";
      code.innerHTML = highlight(raw, lang);
      code.dataset.raw = raw;
      // los comandos partidos con "\" se leen mejor sin ajuste de línea
      if (/\\\n/.test(raw)) code.parentElement.classList.add("multi");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy";
      btn.title = "Copiar";
      btn.setAttribute("aria-label", "Copiar al portapapeles");
      btn.innerHTML = ICONS.copy;
      btn.addEventListener("click", () => copyText(raw, btn));
      code.parentElement.appendChild(btn);
    });
  }

  function copyText(text, btn) {
    const ok = () => {
      btn.classList.add("done");
      btn.innerHTML = ICONS.check;
      setTimeout(() => { btn.classList.remove("done"); btn.innerHTML = ICONS.copy; }, 1400);
    };
    if (navigator.clipboard && window.isSecureContext !== false) {
      navigator.clipboard.writeText(text).then(ok, () => fallbackCopy(text) && ok());
    } else if (fallbackCopy(text)) {
      ok();
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let done = false;
    try { done = document.execCommand("copy"); } catch (e) { done = false; }
    ta.remove();
    return done;
  }

  /* ---------- buscador ---------- */

  function setupSearch() {
    const input = document.getElementById("q");
    if (!input) return;
    const cards = Array.from(document.querySelectorAll("[data-search] .card, [data-search] .cmd, [data-search] .want-row"));
    const sections = Array.from(document.querySelectorAll("[data-search]"));
    const empty = document.querySelector(".empty");
    const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const index = new Map(cards.map(c => [c, norm(c.textContent)]));

    function run() {
      const terms = norm(input.value.trim()).split(/\s+/).filter(Boolean);
      let anyVisible = false;
      cards.forEach(c => {
        const hit = terms.every(t => index.get(c).includes(t));
        c.classList.toggle("hidden", !hit);
      });
      // una tarjeta con alguna fila visible sigue visible
      document.querySelectorAll("[data-search] .card").forEach(card => {
        const rows = card.querySelectorAll(".cmd, .want-row");
        if (!rows.length) return;
        const visibleRows = Array.from(rows).filter(r => !r.classList.contains("hidden"));
        const cardHit = terms.length && terms.every(t => norm(card.querySelector("h3")?.textContent || "").includes(t));
        if (cardHit) rows.forEach(r => r.classList.remove("hidden"));
        card.classList.toggle("hidden", !cardHit && visibleRows.length === 0);
      });
      sections.forEach(s => {
        const vis = s.querySelector(".card:not(.hidden)");
        s.classList.toggle("hidden", !vis);
        if (vis) anyVisible = true;
      });
      if (empty) empty.style.display = anyVisible ? "none" : "block";
    }

    input.addEventListener("input", run);
    document.addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== input) { e.preventDefault(); input.focus(); }
      if (e.key === "Escape" && document.activeElement === input) { input.value = ""; run(); input.blur(); }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildTopbar();
    enhanceCode();
    setupSearch();
  });
})();
