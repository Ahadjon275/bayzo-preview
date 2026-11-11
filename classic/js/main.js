const header = document.querySelector(".site-header");
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");

if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (burger && nav) {
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

document.querySelectorAll(".filters").forEach((bar) => {
  const buttons = bar.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      document.querySelectorAll("[data-cat]").forEach((card) => {
        const show = filter === "all" || card.dataset.cat.split(" ").includes(filter);
        card.classList.toggle("hidden", !show);
      });
    });
  });
});

const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const note = form.querySelector(".form-note");
    const button = form.querySelector("button[type=submit]");
    if (button) button.disabled = true;
    fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        phone: data.get("phone"),
        product: data.get("product"),
        message: data.get("message")
      })
    }).then((response) => response.json().then((body) => {
      if (!response.ok) throw new Error(body.error || "");
      form.reset();
      if (note) {
        note.classList.add("show");
        note.textContent = "Заявка принята. Мы свяжемся с вами по телефону.";
      }
    })).catch(() => {
      if (note) {
        note.classList.add("show");
        note.textContent = "Заявка не отправилась. Позвоните на 88 11 или напишите на info@bayzo.tj.";
      }
    }).finally(() => {
      if (button) button.disabled = false;
    });
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const LANGS = ["ru", "tg", "en", "zh", "tr", "uz", "fa"];
const LANG_KEY = "bayzo-lang";

function savedLang() {
  const query = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(query)) return query;
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch (err) { /* private mode */ }
  return "ru";
}

function langScript(name) {
  const current = document.querySelector("script[src*='main.js']");
  const src = current ? current.getAttribute("src") : "js/main.js";
  return src.replace(/main\.js(\?[^"]*)?$/, name + ".js?v=fast");
}

let langPack = null;
function ensureLangs() {
  if (window.BayzoI18n) return Promise.resolve();
  if (langPack) return langPack;
  langPack = new Promise((resolve, reject) => {
    const more = document.createElement("script");
    more.src = langScript("more");
    more.onload = () => {
      const i18n = document.createElement("script");
      i18n.src = langScript("i18n");
      i18n.onload = () => resolve();
      i18n.onerror = reject;
      document.body.appendChild(i18n);
    };
    more.onerror = reject;
    document.body.appendChild(more);
  });
  return langPack;
}

const langToggle = document.querySelector(".lang-toggle");
const langList = document.querySelector(".lang-list");
if (langToggle && langList) {
  langToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = langList.hidden;
    langList.hidden = !open;
    langToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", () => {
    langList.hidden = true;
    langToggle.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      langList.hidden = true;
      langToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("button[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    if (lang === "ru" && !window.BayzoI18n) {
      try { localStorage.setItem(LANG_KEY, "ru"); } catch (err) { /* private mode */ }
      document.documentElement.lang = "ru";
      document.documentElement.dir = "ltr";
      document.documentElement.dataset.lang = "ru";
      if (langToggle) langToggle.textContent = "RU";
      document.querySelectorAll("button[data-lang]").forEach((item) => {
        const on = item.dataset.lang === "ru";
        item.classList.toggle("active", on);
        item.setAttribute("aria-pressed", on ? "true" : "false");
      });
      return;
    }
    ensureLangs().then(() => {
      if (window.BayzoI18n) window.BayzoI18n.apply(lang);
    });
  });
});

if (savedLang() !== "ru") ensureLangs();
