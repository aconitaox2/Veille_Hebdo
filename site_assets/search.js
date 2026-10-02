(function () {
  "use strict";
  var input = document.getElementById("q");
  var list = document.getElementById("results");
  if (!input || !list) return;
  var index = [];
  fetch("search-index.json").then(function (r) { return r.json(); })
    .then(function (d) { index = d; }).catch(function () {});
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  input.addEventListener("input", function () {
    var q = norm(input.value.trim());
    list.textContent = "";
    if (q.length < 2) return;
    var terms = q.split(/\s+/);
    var hits = index.filter(function (e) {
      var hay = norm(e.t + " " + e.s + " " + e.g);
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    }).slice(0, 20);
    if (!hits.length) {
      var li0 = document.createElement("li"); li0.textContent = "Aucun résultat."; list.appendChild(li0); return;
    }
    hits.forEach(function (e) {
      var li = document.createElement("li");
      var a = document.createElement("a"); a.href = e.u; a.textContent = e.t;
      var meta = document.createElement("small");
      meta.textContent = " · " + e.sec + " · " + e.g + " · semaine " + e.w.split("-W")[1];
      li.appendChild(a); li.appendChild(meta); list.appendChild(li);
    });
  });
})();
