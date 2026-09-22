(function () {
  "use strict";

  /* ====== PENGATURAN TOKO: sesuaikan dengan tokomu ======
     Asumsi jam buka: Senin-Sabtu 08.00-20.00, Minggu 09.00-17.00.
     Ganti sesuai jam buka toko yang sebenarnya. */
  var WA_NUMBER = "6281234567890";
  var HOURS = [
    { day: "Senin",  open: "08:00", close: "20:00" },
    { day: "Selasa", open: "08:00", close: "20:00" },
    { day: "Rabu",   open: "08:00", close: "20:00" },
    { day: "Kamis",  open: "08:00", close: "20:00" },
    { day: "Jumat",  open: "08:00", close: "20:00" },
    { day: "Sabtu",  open: "08:00", close: "20:00" },
    { day: "Minggu", open: "09:00", close: "17:00" }
  ];

  function toMin(t) { var p = t.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function isOpenNow() {
    var now = new Date();
    var idx = (now.getDay() + 6) % 7; // Senin = 0
    var h = HOURS[idx];
    var mins = now.getHours() * 60 + now.getMinutes();
    return mins >= toMin(h.open) && mins < toMin(h.close);
  }
  function todayIdx() { return (new Date().getDay() + 6) % 7; }

  /* ====== KATEGORI & IKON ====== */
  var ICONS = {
    rem: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
    oli: '<path d="M12 3c3 4 6 7 6 10.5a6 6 0 0 1-12 0C6 10 9 7 12 3z"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/>',
    listrik: '<path d="M13 2 5 14h6l-1 8 8-12h-6l1-8z"/>',
    suspensi: '<path d="M8 3h8M8 21h8M12 3v2M12 19v2M7 6l10 2-10 2 10 2-10 2 10 2-10 2"/>',
    transmisi: '<circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="7"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>',
    busi: '<path d="M9 3h6v4H9zM10 7v6M14 7v6M8 13h8v3l-2 2v3h-4v-3l-2-2z"/>',
    aksesori: '<path d="M3 17c5-9 13-9 18 0M12 17 8 8"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }
  var CATS = [
    { id: "rem",       name: "Rem",             icon: "rem" },
    { id: "oli",       name: "Oli dan cairan",  icon: "oli" },
    { id: "filter",    name: "Filter",          icon: "filter" },
    { id: "kelistrikan", name: "Aki dan lampu", icon: "listrik" },
    { id: "suspensi",  name: "Suspensi",        icon: "suspensi" },
    { id: "transmisi", name: "Transmisi",       icon: "transmisi" },
    { id: "pengapian", name: "Busi",            icon: "busi" },
    { id: "aksesori",  name: "Wiper",           icon: "aksesori" }
  ];
  var CAT_BY_ID = {};
  CATS.forEach(function (c) { CAT_BY_ID[c.id] = c; });

  /* ====== DATA MOBIL ====== */
  var MAKES = {
    "Toyota":     ["Avanza", "Kijang Innova", "Agya", "Rush"],
    "Daihatsu":   ["Xenia", "Sigra", "Ayla", "Terios"],
    "Honda":      ["Brio", "Jazz", "Mobilio"],
    "Mitsubishi": ["Xpander", "Pajero Sport"],
    "Suzuki":     ["Ertiga", "XL7"]
  };

  /* ====== PRODUK CONTOH: ganti dengan produk & harga asli tokomu ======
     fits: daftar [merek, model]; null = cocok untuk banyak mobil, cek di toko */
  var PRODUCTS = [
    { id: 1,  name: "Kampas Rem Depan Avanza dan Xenia", cat: "rem",         price: 165000, tag: "Aftermarket", fits: [["Toyota","Avanza"],["Daihatsu","Xenia"]] },
    { id: 2,  name: "Filter Oli Kijang Innova",           cat: "filter",     price: 45000,  tag: "Original",    fits: [["Toyota","Kijang Innova"],["Toyota","Rush"]] },
    { id: 3,  name: "Busi Denso Iridium (set 4)",         cat: "pengapian",  price: 220000, tag: "Original",    fits: [["Toyota","Avanza"],["Daihatsu","Xenia"],["Toyota","Kijang Innova"]] },
    { id: 4,  name: "Aki GS Astra NS60",                  cat: "kelistrikan",price: 985000, tag: "Original",    fits: [["Toyota","Kijang Innova"],["Mitsubishi","Pajero Sport"]] },
    { id: 5,  name: "Shockbreaker Depan KYB",             cat: "suspensi",   price: 425000, tag: "Original",    fits: [["Daihatsu","Xenia"],["Toyota","Avanza"]] },
    { id: 6,  name: "Filter Udara Brio",                  cat: "filter",     price: 85000,  tag: "Original",    fits: [["Honda","Brio"]] },
    { id: 7,  name: "Wiper Bosch 20 inci",                cat: "aksesori",   price: 65000,  tag: "Original",    fits: null },
    { id: 8,  name: "Oli Shell Helix HX7 4 L",            cat: "oli",        price: 385000, tag: "Original",    fits: null },
    { id: 9,  name: "Kampas Rem Depan Xpander",           cat: "rem",        price: 210000, tag: "Aftermarket", fits: [["Mitsubishi","Xpander"]] },
    { id: 10, name: "Bohlam H4 Philips (sepasang)",       cat: "kelistrikan",price: 135000, tag: "Original",    fits: null },
    { id: 11, name: "Filter Udara Mobilio",               cat: "filter",     price: 92000,  tag: "Aftermarket", fits: [["Honda","Mobilio"]] },
    { id: 12, name: "Oli Matic Toyota Genuine ATF",       cat: "oli",        price: 145000, tag: "Original",    fits: [["Toyota","Avanza"],["Toyota","Rush"],["Toyota","Kijang Innova"]] },
    { id: 13, name: "Timing Belt Set Xenia dan Avanza",   cat: "transmisi",  price: 385000, tag: "Original",    fits: [["Daihatsu","Xenia"],["Toyota","Avanza"]] },
    { id: 14, name: "Kampas Kopling Ertiga",              cat: "transmisi",  price: 265000, tag: "Aftermarket", fits: [["Suzuki","Ertiga"]] },
    { id: 15, name: "Shockbreaker Belakang Terios dan Rush", cat: "suspensi", price: 395000, tag: "Aftermarket", fits: [["Daihatsu","Terios"],["Toyota","Rush"]] },
    { id: 16, name: "Aki Incoe NS40",                     cat: "kelistrikan",price: 685000, tag: "Aftermarket", fits: [["Toyota","Agya"],["Daihatsu","Ayla"]] },
    { id: 17, name: "Filter AC Kabin Universal",          cat: "filter",     price: 55000,  tag: "Aftermarket", fits: null },
    { id: 18, name: "Busi NGK Standar (set 4)",           cat: "pengapian",  price: 95000,  tag: "Original",    fits: [["Honda","Brio"],["Honda","Jazz"],["Honda","Mobilio"]] }
  ];
  var PROD_BY_ID = {};
  PRODUCTS.forEach(function (p) { PROD_BY_ID[p.id] = p; });

  /* ====== UTIL ====== */
  function rp(n) { return "Rp " + Number(n).toLocaleString("id-ID"); }
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function fitText(p) {
    if (!p.fits) return "Cocok untuk beberapa tipe mobil, dicek langsung saat kunjungan atau chat";
    var byMake = {}, order = [];
    p.fits.forEach(function (f) {
      if (!byMake[f[0]]) { byMake[f[0]] = []; order.push(f[0]); }
      byMake[f[0]].push(f[1]);
    });
    return "Cocok untuk " + order.map(function (m) { return m + " " + byMake[m].join(", "); }).join("; ");
  }

  /* ====== STATE ====== */
  var state = { cat: "all", q: "", sort: "rek" };

  function matches(p) {
    if (state.cat !== "all" && p.cat !== state.cat) return false;
    if (state.q) {
      var hay = (p.name + " " + p.tag + " " + fitText(p) + " " + CAT_BY_ID[p.cat].name).toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  /* ====== RENDER: kategori ====== */
  function renderCats() {
    var html = CATS.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      return '<button class="cat" type="button" data-cat="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' +
        '<span class="ico-box">' + icon(c.icon) + '</span>' +
        '<span><strong>' + esc(c.name) + '</strong><small>' + n + ' produk</small></span></button>';
    }).join("");
    $("cats").innerHTML = html;
  }

  /* ====== RENDER: produk ====== */
  function renderProducts() {
    var list = PRODUCTS.filter(matches);
    if (state.sort === "murah") list.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === "mahal") list.sort(function (a, b) { return b.price - a.price; });
    if (state.sort === "nama") list.sort(function (a, b) { return a.name.localeCompare(b.name, "id"); });

    if (!list.length) {
      $("grid").innerHTML = '<div class="empty"><h3>Belum ada part yang cocok</h3>' +
        '<p>Coba hapus sebagian filter, atau tanyakan langsung ke tim kami.</p>' +
        '<button class="btn" type="button" data-action="reset">Hapus semua filter</button></div>';
    } else {
      $("grid").innerHTML = list.map(function (p) {
        return '<article class="card">' +
          '<div class="card-art"><span class="badge ' + (p.tag === "Original" ? "ori" : "") + '">' + p.tag + '</span>' + icon(CAT_BY_ID[p.cat].icon) + '</div>' +
          '<div class="card-body"><h3>' + esc(p.name) + '</h3><p class="fit">' + esc(fitText(p)) + '</p>' +
          '<div class="card-foot"><strong class="price">' + rp(p.price) + '</strong>' +
          '<button class="btn sm" type="button" data-add="' + p.id + '" aria-label="Tambah ' + esc(p.name) + ' ke daftar belanja">Tambah</button></div></div></article>';
      }).join("");
    }

    var filtered = state.cat !== "all" || state.q;
    var txt = "<strong>" + list.length + " produk</strong>";
    if (state.cat !== "all") txt += " di kategori " + esc(CAT_BY_ID[state.cat].name.toLowerCase());
    $("status-text").innerHTML = txt;
    $("reset").hidden = !filtered;

    document.querySelectorAll(".cat").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat));
    });
  }

  /* ====== TOOLBAR ====== */
  $("q").addEventListener("input", function (e) { state.q = e.target.value.trim(); renderProducts(); });
  $("sort").addEventListener("change", function (e) { state.sort = e.target.value; renderProducts(); });
  function resetFilters() {
    state = { cat: "all", q: "", sort: state.sort };
    $("q").value = "";
    renderProducts();
  }
  $("reset").addEventListener("click", resetFilters);

  /* ====== KERANJANG ====== */
  var cart = {};
  try {
    var saved = JSON.parse(localStorage.getItem("od24-cart") || "{}");
    Object.keys(saved).forEach(function (k) { if (PROD_BY_ID[k] && saved[k] > 0) cart[k] = Math.min(99, saved[k] | 0); });
  } catch (e) { /* penyimpanan tidak tersedia */ }
  function persist() { try { localStorage.setItem("od24-cart", JSON.stringify(cart)); } catch (e) {} }

  var drawer = $("drawer"), overlay = $("overlay"), lastFocus = null;
  function cartCount() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function cartTotal() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k] * PROD_BY_ID[k].price; }, 0); }

  function waLink(text) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text); }

  function renderCart(bump) {
    var n = cartCount(), ids = Object.keys(cart);
    var badge = $("cart-count");
    badge.textContent = n;
    badge.setAttribute("aria-label", n + " barang");
    if (bump) { badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump"); }

    var open = isOpenNow();
    $("drawer-mode-note").textContent = open
      ? "Toko sedang buka. Kamu bisa datang langsung, atau kirim daftar ini lewat WhatsApp lebih dulu."
      : "Toko sedang tutup. Kirim daftar ini lewat WhatsApp, kami balas begitu toko buka.";

    if (!ids.length) {
      $("drawer-body").innerHTML = '<div class="drawer-empty"><h3>Daftar belanja masih kosong</h3><p>Pilih sparepart dari katalog, lalu kembali ke sini.</p><button class="btn" type="button" data-action="browse">Lihat katalog</button></div>';
    } else {
      $("drawer-body").innerHTML = ids.map(function (k) {
        var p = PROD_BY_ID[k];
        return '<div class="line-item"><div class="line-art">' + icon(CAT_BY_ID[p.cat].icon) + '</div><div>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<div class="line-meta"><div class="qty"><button type="button" data-dec="' + k + '" aria-label="Kurangi jumlah ' + esc(p.name) + '">&minus;</button><span aria-live="polite">' + cart[k] + '</span><button type="button" data-inc="' + k + '" aria-label="Tambah jumlah ' + esc(p.name) + '">+</button></div>' +
          '<strong class="price">' + rp(p.price * cart[k]) + '</strong></div>' +
          '<button class="link-btn" type="button" data-remove="' + k + '">Hapus</button></div></div>';
      }).join("");
    }

    $("subtotal").textContent = rp(cartTotal());
    var co = $("checkout");
    if (!ids.length) {
      co.setAttribute("aria-disabled", "true");
      co.setAttribute("tabindex", "-1");
      co.href = "#";
      co.textContent = "Kirim daftar ke WhatsApp";
    } else {
      var lines = ids.map(function (k, i) {
        var p = PROD_BY_ID[k];
        return (i + 1) + ". " + p.name + " x" + cart[k] + " = " + rp(p.price * cart[k]);
      });
      var greeting = open
        ? "Halo ONDERDEEL24, saya mau tanya ketersediaan part berikut sebelum datang ke toko:"
        : "Halo ONDERDEEL24, toko sepertinya sedang tutup. Saya ingin memesan part berikut, mohon dikonfirmasi begitu toko buka:";
      var msg = greeting + "\n\n" + lines.join("\n") + "\n\nPerkiraan total: " + rp(cartTotal()) + "\n\nNama:\nMobil (merek, model, tahun):";
      co.href = waLink(msg);
      co.setAttribute("aria-disabled", "false");
      co.removeAttribute("tabindex");
      co.textContent = open ? "Tanyakan lewat WhatsApp" : "Kirim daftar ke WhatsApp";
    }
    persist();
  }

  function openCart() {
    lastFocus = document.activeElement;
    drawer.inert = false;
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.documentElement.classList.add("locked");
    $("close-cart").focus();
  }
  function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.documentElement.classList.remove("locked");
    drawer.inert = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $("open-cart").addEventListener("click", openCart);
  $("close-cart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  /* ====== NAVBAR MOBILE ====== */
  var navToggle = $("nav-toggle"), mobileNav = $("mobile-nav");
  function setNav(open) {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    mobileNav.classList.toggle("open", open);
  }
  navToggle.addEventListener("click", function () {
    setNav(navToggle.getAttribute("aria-expanded") !== "true");
  });
  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setNav(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setNav(false);
      navToggle.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
    if (e.key === "Tab" && drawer.classList.contains("open")) {
      var f = drawer.querySelectorAll('button, a[href]:not([aria-disabled="true"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ====== EVENT DELEGASI ====== */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-add],[data-inc],[data-dec],[data-remove],[data-cat],[data-action]");
    if (!t) return;

    if (t.dataset.add) {
      var id = t.dataset.add;
      cart[id] = Math.min(99, (cart[id] || 0) + 1);
      renderCart(true);
      toast(PROD_BY_ID[id].name + " masuk daftar belanja");
    } else if (t.dataset.inc) {
      cart[t.dataset.inc] = Math.min(99, cart[t.dataset.inc] + 1);
      renderCart(true);
    } else if (t.dataset.dec) {
      cart[t.dataset.dec] -= 1;
      if (cart[t.dataset.dec] <= 0) delete cart[t.dataset.dec];
      renderCart(false);
    } else if (t.dataset.remove) {
      delete cart[t.dataset.remove];
      renderCart(false);
    } else if (t.dataset.cat) {
      state.cat = (t.tagName === "BUTTON" && state.cat === t.dataset.cat) ? "all" : t.dataset.cat;
      renderProducts();
      if (t.tagName === "BUTTON") $("produk").scrollIntoView();
    } else if (t.dataset.action === "reset") {
      resetFilters();
    } else if (t.dataset.action === "browse") {
      closeCart();
      $("produk").scrollIntoView();
    }
  });

  /* ====== JAM BUKA: render status ====== */
  function renderHours() {
    var idx = todayIdx();
    var html = HOURS.map(function (h, i) {
      return '<li class="' + (i === idx ? "today" : "") + '"><span>' + h.day + '</span><span>' + h.open + '\u2013' + h.close + '</span></li>';
    }).join("");
    $("hours-list").innerHTML = html;
    $("foot-hours").innerHTML = HOURS.map(function (h, i) {
      return '<li class="hrs"><span>' + h.day + '</span><span>' + h.open + '\u2013' + h.close + '</span></li>';
    }).join("");
  }

  function renderOpenState() {
    var open = isOpenNow();
    var idx = todayIdx();
    var h = HOURS[idx];

    var topbar = $("topbar");
    topbar.className = "topbar " + (open ? "is-open" : "is-closed");
    $("topbar-text").textContent = open
      ? "Toko buka sekarang sampai jam " + h.close
      : "Toko sedang tutup, buka lagi jam " + h.open;
    $("topbar-link").style.display = open ? "none" : "inline";

    var when = $("visit-when");
    when.className = "when " + (open ? "open" : "closed");
    $("visit-when-text").textContent = open
      ? "Toko sedang buka sampai jam " + h.close + " hari ini"
      : "Toko sedang tutup. Buka lagi jam " + h.open + " (" + h.day + ")";
  }

  /* ====== INIT ====== */
  var waGreetOpen = "Halo ONDERDEEL24, saya ingin menanyakan sparepart mobil.";
  var waGreetClosed = "Halo ONDERDEEL24, saya tahu toko sedang tutup. Saya ingin menanyakan sparepart untuk mobil saya, mohon dibalas saat toko buka.";
  function waGreeting() { return isOpenNow() ? waGreetOpen : waGreetClosed; }

  ["cta-wa", "foot-wa", "mode-wa", "visit-wa"].forEach(function (id) {
    var el = $(id);
    if (el) el.href = waLink(waGreeting());
  });

  renderHours();
  renderOpenState();
  renderCats();
  renderProducts();
  renderCart(false);
  setInterval(function () {
    renderOpenState();
    ["cta-wa", "foot-wa", "mode-wa", "visit-wa"].forEach(function (id) {
      var el = $(id);
      if (el) el.href = waLink(waGreeting());
    });
  }, 60000);
})();