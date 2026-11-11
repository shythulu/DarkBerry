const D = __DATA__;
const $ = (id) => document.getElementById(id);
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
const FLS = Object.keys(D.flavours), TINTS = Object.keys(D.tints);
let fl = FLS.includes(store.get("darkberry-flavour")) ? store.get("darkberry-flavour") : "blackwater";
let tn = TINTS.includes(store.get("darkberry-tint")) ? store.get("darkberry-tint") : "darkberry";
// A link can name the flavour and tint (index.html#mire/cloudberry), over the saved choice.
const [hf, ht] = location.hash.slice(1).split("/");
if (FLS.includes(hf)) fl = hf;
if (TINTS.includes(ht)) tn = ht;
// The repository's tree on the published branch: the Ports page links each port's folder under it.
const tree = D.tree;
// Each page script pushes a render function here; apply() calls them after every flavour or tint change.
const page = [];

function apply() {
  const t = D.tints[tn], roles = t.roles[fl], s = document.documentElement.style;
  for (const [r, v] of Object.entries(roles)) s.setProperty("--" + r.replace(/\./g, "-"), v);
  D.order.forEach((k, i) => s.setProperty("--c-" + k, t.colors[fl][i]));
  document.documentElement.dataset.theme = D.flavours[fl].dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.remove();
  document.head.insertAdjacentHTML("beforeend", `<meta name="theme-color" content="${roles["ui.pane.secondary"]}">`);
  store.set("darkberry-flavour", fl); store.set("darkberry-tint", tn);
  if ($("tintnote")) $("tintnote").textContent = t.note;
  document.querySelectorAll("#pick-flavour button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.f === fl));
  document.querySelectorAll("#pick-tint button").forEach((b) => { b.setAttribute("aria-pressed", b.dataset.t === tn); b.querySelector("i").style.background = D.tints[b.dataset.t].roles[fl]["ui.tab.indicator"]; });
  page.forEach((f) => f());
}
function copy(text, row) {
  const done = () => { toast(`Copied ${text}`); if (row) { row.classList.add("copied"); setTimeout(() => row.classList.remove("copied"), 900); } };
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => toast(text)); else toast(text);
}
let tt; function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1400); }

// A page can carry either picker on its own: the home page has only the flavours.
if ($("pick-flavour")) {
  $("pick-flavour").innerHTML = FLS.map((f) => `<button data-f="${f}" aria-pressed="false">${D.flavours[f].emoji} ${D.flavours[f].name}</button>`).join("");
  document.querySelectorAll("#pick-flavour button").forEach((b) => b.onclick = () => { fl = b.dataset.f; apply(); });
}
if ($("pick-tint")) {
  $("pick-tint").innerHTML = TINTS.map((t) => `<button data-t="${t}" aria-pressed="false"><i></i>${D.tints[t].name}</button>`).join("");
  document.querySelectorAll("#pick-tint button").forEach((b) => b.onclick = () => { tn = b.dataset.t; apply(); });
}
