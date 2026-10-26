(function () {
  var cards = document.querySelectorAll("[data-place-card]");
  if (!cards.length) return;

  function show(id) {
    document.querySelectorAll("[data-place]").forEach(function (el) {
      var on = el.getAttribute("data-place") === id;
      el.classList.toggle("active", on);
      if (el.tagName === "BUTTON") el.setAttribute("aria-pressed", on ? "true" : "false");
    });
    cards.forEach(function (card) {
      card.hidden = card.getAttribute("data-place-card") !== id;
    });
  }

  document.querySelectorAll("[data-place]").forEach(function (el) {
    el.addEventListener("click", function () {
      show(el.getAttribute("data-place"));
    });
  });

  show("gafurov");
})();
