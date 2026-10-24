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
    const lang = document.documentElement.dataset.lang || "ru";
    const labels = {
      ru: { name: "Имя", phone: "Телефон", subject: "Заявка с сайта Bayzo" },
      tg: { name: "Ном", phone: "Телефон", subject: "Дархост аз сомонаи Bayzo" },
      en: { name: "Name", phone: "Phone", subject: "Request from the Bayzo website" },
      zh: { name: "姓名", phone: "电话", subject: "来自 Bayzo 网站的申请" },
      tr: { name: "Ad", phone: "Telefon", subject: "Bayzo sitesinden talep" },
      uz: { name: "Ism", phone: "Telefon", subject: "Bayzo saytidan ariza" },
      fa: { name: "نام", phone: "تلفن", subject: "درخواست از وب‌سایت Bayzo" }
    }[lang] || { name: "Имя", phone: "Телефон", subject: "Заявка с сайта Bayzo" };
    const body = [
      labels.name + ": " + data.get("name"),
      labels.phone + ": " + data.get("phone"),
      "",
      data.get("message")
    ].join("\n");
    const note = form.querySelector(".form-note");
    if (note) note.classList.add("show");
    window.location.href = "mailto:info@bayzo.tj?subject=" + encodeURIComponent(labels.subject) + "&body=" + encodeURIComponent(body);
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
