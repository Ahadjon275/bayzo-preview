(function () {
  var root = /\/classic\//.test(location.pathname) ? "../" : "";

  function photo(src) {
    if (!src) return "";
    if (src.indexOf("https://") === 0 || src.indexOf("http://") === 0) return src;
    return root + src.replace(/^\//, "");
  }
  function lines(list) {
    return (list || []).map(function (item) { return String(item || "").trim(); }).filter(Boolean);
  }

  function listBlock(parent, heading, items) {
    var ready = lines(items);
    if (!ready.length) return;
    var title = document.createElement("h3");
    title.textContent = heading;
    var ul = document.createElement("ul");
    ready.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    parent.appendChild(title);
    parent.appendChild(ul);
  }

  function renderJobs(data) {
    var box = document.querySelector(".jobs");
    if (!box) return;
    var contacts = data.contacts || {};
    box.replaceChildren();
    (data.vacancies || []).forEach(function (job) {
      var article = document.createElement("article");
      article.className = "job";
      if (job.tag) {
        var badge = document.createElement("p");
        badge.className = "badge";
        badge.textContent = job.tag;
        article.appendChild(badge);
      }
      var h2 = document.createElement("h2");
      h2.textContent = job.title || "";
      article.appendChild(h2);
      if (job.lead) {
        var lead = document.createElement("p");
        lead.textContent = job.lead;
        article.appendChild(lead);
      }
      listBlock(article, "Задачи", job.tasks);
      listBlock(article, "Нужно", job.needs);
      listBlock(article, "Условия", job.terms);
      var foot = document.createElement("p");
      foot.className = "job-foot";
      if (job.showEmail !== false && contacts.hrEmail) {
        var mail = document.createElement("a");
        mail.href = "mailto:" + contacts.hrEmail + "?subject=" + encodeURIComponent(job.title || "");
        mail.textContent = contacts.hrEmail;
        foot.appendChild(mail);
      }
      if (contacts.phoneHrHref && contacts.phoneHr) {
        var phone = document.createElement("a");
        phone.href = contacts.phoneHrHref;
        phone.textContent = contacts.phoneHr;
        foot.appendChild(phone);
      }
      if (foot.childNodes.length) article.appendChild(foot);
      box.appendChild(article);
    });
  }

  function fillProducts(box, items, linked) {
    box.replaceChildren();
    items.forEach(function (item) {
      var article = document.createElement(linked ? "a" : "article");
      article.className = "product";
      if (linked) article.href = "catalog.html";
      else article.dataset.cat = item.cat || "fresh";
      if (item.image) {
        var img = document.createElement("img");
        img.src = photo(item.image);
        img.alt = item.title || "";
        article.appendChild(img);
      }
      var body = document.createElement("div");
      body.className = "product-body";
      if (item.badge) {
        var badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = item.badge;
        body.appendChild(badge);
      }
      var h3 = document.createElement("h3");
      h3.textContent = item.title || "";
      body.appendChild(h3);
      article.appendChild(body);
      box.appendChild(article);
    });
  }

  function renderPartners(data) {
    var track = document.querySelector("[data-content='partners']");
    if (!track) return;
    var items = (data.partners || []).filter(function (item) { return item && item.image; });
    track.replaceChildren();
    if (!items.length) return;
    var count = items.length;
    while (count < 8) count += items.length;
    function makeSet(hidden) {
      var set = document.createElement("div");
      set.className = "logo-set";
      if (hidden) set.setAttribute("aria-hidden", "true");
      for (var i = 0; i < count; i++) {
        var item = items[i % items.length];
        var img = document.createElement("img");
        img.src = photo(item.image);
        img.alt = item.name || "Партнёр";
        set.appendChild(img);
      }
      return set;
    }
    track.appendChild(makeSet(false));
    track.appendChild(makeSet(true));
  }

  function renderStores(data) {
    var box = document.querySelector("[data-content='stores']");
    if (!box) return;
    var items = (data.stores || []).filter(function (item) { return item && item.address; });
    box.replaceChildren();
    if (!items.length) {
      var empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Адреса магазинов появятся здесь.";
      box.appendChild(empty);
      return;
    }
    var head = document.createElement("div");
    head.className = "store-head";
    ["Адрес", "Время работы", ""].forEach(function (label) {
      var span = document.createElement("span");
      span.textContent = label;
      head.appendChild(span);
    });
    box.appendChild(head);
    items.forEach(function (item) {
      var row = document.createElement("div");
      row.className = "store-row";
      var address = document.createElement("p");
      address.textContent = item.address;
      var hours = document.createElement("p");
      hours.textContent = item.hours || "";
      row.appendChild(address);
      row.appendChild(hours);
      if (item.map && item.map.indexOf("https://") === 0) {
        var link = document.createElement("a");
        link.className = "btn btn-line";
        link.href = item.map;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = "Показать на карте";
        row.appendChild(link);
      }
      box.appendChild(row);
    });
  }

  function renderProducts(data) {
    var catalog = document.querySelector("[data-content='catalog']");
    var home = document.querySelector("[data-content='home']");
    var items = data.products || [];
    if (catalog) fillProducts(catalog, items, false);
    if (home) fillProducts(home, items.slice(0, 4), true);
  }

  function applyContacts(contacts) {
    document.querySelectorAll('a[href="tel:8811"]').forEach(function (link) {
      link.href = contacts.phoneShortHref || link.href;
      link.textContent = contacts.phoneShort || link.textContent;
    });
    document.querySelectorAll('a[href="tel:+992924008811"]').forEach(function (link) {
      link.href = contacts.phoneHrHref || link.href;
      if (link.textContent.indexOf("400") >= 0 || link.textContent.indexOf("92") >= 0) {
        link.textContent = link.classList.contains("btn") ? contacts.phoneHr.replace("+992 ", "") : contacts.phoneHr;
      }
    });
    document.querySelectorAll('a[href^="mailto:info@bayzo.tj"]').forEach(function (link) {
      if (!contacts.email) return;
      link.href = "mailto:" + contacts.email;
      if (link.textContent.indexOf("@") >= 0) link.textContent = contacts.email;
    });
    document.querySelectorAll('a[href^="mailto:hr@bayzo.tj"]').forEach(function (link) {
      if (!contacts.hrEmail) return;
      var subject = link.href.indexOf("?") >= 0 ? link.href.slice(link.href.indexOf("?")) : "";
      link.href = "mailto:" + contacts.hrEmail + subject;
      if (link.textContent.indexOf("@") >= 0) link.textContent = contacts.hrEmail;
    });
    document.querySelectorAll("[data-contact='address']").forEach(function (node) {
      if (contacts.address) node.textContent = contacts.address;
    });
    var map = document.querySelector("[data-contact='map']");
    if (map && contacts.map) map.href = contacts.map;
  }

  fetch(root + "data/content.json", { cache: "no-store" })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (data) {
      if (!data) return;
      applyContacts(data.contacts || {});
      renderJobs(data);
      renderProducts(data);
      renderPartners(data);
      renderStores(data);
      if (window.BayzoI18n) window.BayzoI18n.apply();
    })
    .catch(function () {});
})();
