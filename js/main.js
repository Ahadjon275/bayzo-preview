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
