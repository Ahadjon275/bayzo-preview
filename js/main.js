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
  const cards = document.querySelectorAll("[data-cat]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      cards.forEach((card) => {
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
    const body = [
      "Имя: " + data.get("name"),
      "Телефон: " + data.get("phone"),
      "",
      data.get("message")
    ].join("\n");
    const note = form.querySelector(".form-note");
    if (note) note.classList.add("show");
    window.location.href = "mailto:info@bayzo.tj?subject=" + encodeURIComponent("Заявка с сайта Bayzo") + "&body=" + encodeURIComponent(body);
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());
