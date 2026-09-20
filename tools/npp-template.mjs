// Builds src/ports/notepadpp.xml from Notepad++'s own stylers.model.xml.
//   node tools/npp-template.mjs <path-to-stylers.model.xml>
//
// Notepad++ themes are one file covering every lexer, and a lexer's styles are
// addressed by name and numeric styleID. Those identifiers are the interface
// Notepad++ exposes — a theme has to use them verbatim or the styles do not
// apply — so the skeleton is taken from the upstream model file. Every colour
// and font decision here is Darkberry's own; nothing is copied from the themes
// Notepad++ ships, which are GPL2 and would not mix with this project's MIT.
//
// Rerun this when Notepad++ adds lexers, then `node build.mjs`.
import fs from "node:fs";

const src = process.argv[2];
if (!src) { console.error("usage: node tools/npp-template.mjs <stylers.model.xml>"); process.exit(1); }

// Style name -> role. Matched longest-first so "COMMENT DOC" wins over "COMMENT".
const WORD_STYLES = [
  ["COMMENT", "syntax.comment"],
  ["PREPROCESSOR COMMENT", "syntax.comment"],
  ["NUMBER", "syntax.number"],
  ["FLOAT", "syntax.number"],
  ["HEX", "syntax.number"],
  ["STRING", "syntax.string"],
  ["CHARACTER", "syntax.string"],
  ["VERBATIM", "syntax.string"],
  ["BACKTICKS", "syntax.string"],
  ["REGEX", "syntax.regex"],
  ["OPERATOR", "syntax.operator"],
  ["IDENTIFIER", "syntax.variable"],
  ["VARIABLE", "syntax.variable"],
  ["PARAMETER", "syntax.property"],
  ["ATTRIBUTE", "syntax.property"],
  ["PROPERTY", "syntax.property"],
  ["INSTRUCTION WORD", "syntax.keyword"],
  ["KEYWORD", "syntax.keyword"],
  ["WORD", "syntax.keyword"],
  ["TYPE WORD", "syntax.type"],
  ["DATA TYPE", "syntax.type"],
  ["CLASS", "syntax.type"],
  ["TAG", "syntax.type"],
  ["FUNCTION", "syntax.function"],
  ["METHOD", "syntax.function"],
  ["PREPROCESSOR", "syntax.namespace"],
  ["DIRECTIVE", "syntax.namespace"],
  ["USER KEYWORDS", "syntax.constant"],
  ["CONSTANT", "syntax.constant"],
  ["SYMBOL", "syntax.punctuation"],
  ["ERROR", "syntax.error"],
];
const BOLD = /KEYWORD|INSTRUCTION WORD/;
const ITALIC = /COMMENT/;

function roleFor(name) {
  const n = name.toUpperCase();
  let best = null;
  for (const [key, role] of WORD_STYLES)
    if (n.includes(key) && (!best || key.length > best[0].length)) best = [key, role];
  return best ? best[1] : "syntax.text";
}

// The editor chrome. Anything not named here falls back to text on background,
// which is dull but never unreadable.
const WIDGETS = {
  "Default Style": ["syntax.text", "ui.background"],
  "Indent guideline style": ["surface1", "ui.background"],
  "Brace highlight style": ["ui.accent", "surface1"],
  "Bad brace colour": ["ui.error", "ui.background"],
  "Current line background colour": [null, "surface0"],
  "Selected text colour": ["ui.text", "ui.selection"],
  "Multi-selected text color": [null, "surface2"],
  "Caret colour": ["ui.cursor", null],
  "Multi-edit carets color": ["ui.cursor", null],
  "Edge colour": ["overlay0", null],
  "Line number margin": ["ui.text.subtle", "ui.pane.secondary"],
  "Bookmark margin": [null, "ui.pane.secondary"],
  "Change History margin": [null, "ui.pane.secondary"],
  "Change History modified": ["ui.warning", "ui.warning"],
  "Change History revert modified": ["ui.info", "ui.info"],
  "Change History revert origin": ["ui.link", "ui.link"],
  "Change History saved": ["ui.success", "ui.success"],
  "Fold": ["overlay0", "ui.pane.secondary"],
  "Fold active": ["ui.accent", null],
  "Fold margin": ["ui.pane.tertiary", "ui.pane.secondary"],
  "White space symbol": ["overlay0", null],
  "Smart Highlighting": [null, "ui.mark1"],
  "Find Mark Style": [null, "ui.mark2"],
  "Mark Style 1": [null, "ui.mark1"],
  "Mark Style 2": [null, "ui.mark2"],
  "Mark Style 3": [null, "ui.mark3"],
  "Mark Style 4": [null, "ui.mark1"],
  "Mark Style 5": [null, "ui.mark2"],
  "Incremental highlight all": [null, "ui.fill"],
  "Tags match highlighting": [null, "surface2"],
  "Tags attribute": ["syntax.property", null],
  "Active tab focused indicator": ["ui.tab.indicator", null],
  "Active tab unfocused indicator": ["ui.border.inactive", null],
  "Active tab text": ["ui.text", null],
  "Inactive tabs": ["ui.text.muted", "ui.pane.tertiary"],
  "URL hovered": ["ui.link", null],
  "Find status: Not found": ["ui.error", null],
  "Find status: Message": ["ui.info", null],
  "Find status: Search end reached": ["ui.success", null],
  "Find status: Invalid regular expression": ["ui.error", null],
};

// stylers.model.xml ships with CRLF. Keeping it would make the generated themes
// differ by line ending between platforms, and the release workflow checks that the
// committed ports match a fresh build — on a Linux runner that check would fail
// forever. XML does not care, so normalise to LF.
let xml = fs.readFileSync(src, "utf8").replace(/\r\n/g, "\n");

// Drop the upstream header, and state where this file came from.
xml = xml.replace(/^<\?xml[^>]*\?>\s*/, "");
xml = xml.replace(/<!--[\s\S]*?-->\s*/g, "");

const attr = (tag, name, value) => {
  if (value === null) return tag.replace(new RegExp(`\\s${name}="[^"]*"`), "");
  const re = new RegExp(`${name}="[^"]*"`);
  if (re.test(tag)) return tag.replace(re, `${name}="${value}"`);
  // Insert before the close, keeping "/>" self-closing: dropping the slash
  // silently turns every WordsStyle into an unclosed element.
  return tag.replace(/(\s*\/?>)$/, ` ${name}="${value}"$1`);
};

// Some lexer style names carry literal braces and hashes, e.g. "BINARY ( 16#{1A803F59} )"
// and "ISSUE { #123-CD-456 }". Braces would read as role references when the template is
// filled, and a hash followed by three hex digits trips the build's literal-colour guard.
// Escaping all three as entities keeps the name byte-identical once XML is parsed, so
// Notepad++ still matches it. The entity forms are chosen to not look like colours
// themselves: &#123; would contain "#123".
const escapeName = (v) => v
  .replace(/#/g, "&#35;")
  .replace(/\{/g, "&#x7B;")
  .replace(/\}/g, "&#x7D;");
xml = xml.replace(/name="([^"]*)"/g, (m, v) =>
  /[#{}]/.test(v) ? `name="${escapeName(v)}"` : m);

xml = xml.replace(/<WordsStyle\b[^>]*\/?>/g, (tag) => {
  const name = /name="([^"]*)"/.exec(tag)?.[1] ?? "";
  const role = roleFor(name);
  let out = attr(tag, "fgColor", `{${role}}`);
  out = attr(out, "bgColor", "{ui.background}");
  out = attr(out, "fontName", "");
  out = attr(out, "fontStyle", BOLD.test(name.toUpperCase()) ? "1" : ITALIC.test(name.toUpperCase()) ? "2" : "0");
  return out;
});

xml = xml.replace(/<WidgetStyle\b[^>]*>/g, (tag) => {
  const name = /name="([^"]*)"/.exec(tag)?.[1] ?? "";
  const [fg, bg] = WIDGETS[name] ?? ["syntax.text", "ui.background"];
  let out = tag;
  if (/fgColor="/.test(tag) || fg) out = attr(out, "fgColor", fg ? `{${fg}}` : null);
  if (/bgColor="/.test(tag) || bg) out = attr(out, "bgColor", bg ? `{${bg}}` : null);
  return out;
});

const header = `<?xml version="1.0" encoding="UTF-8" ?>
<!--
%FULL% for Notepad++. %NOTE%

Generated by build.mjs from src/ports/notepadpp.xml. Do not edit ports/notepadpp/.
That template is itself produced by tools/npp-template.mjs from Notepad++'s
stylers.model.xml: the lexer names, style names and styleIDs are the interface
Notepad++ exposes and have to match exactly, while every colour is Darkberry's.

Copy into %APPDATA%\\Notepad++\\themes\\, then Settings > Style Configurator.
-->
`;

fs.writeFileSync("src/ports/notepadpp.xml", header + xml.trimStart());
const n = (xml.match(/<LexerType /g) || []).length;
const w = (xml.match(/<WidgetStyle /g) || []).length;
console.log(`src/ports/notepadpp.xml: ${n} lexers, ${w} widget styles`);
