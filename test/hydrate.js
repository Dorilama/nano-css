const { JSDOM } = require("jsdom");

let ssrGlobal = ":root {--pad: 1rem;}";
let ssrSelectors = [
  ["color: #000;", "._4e6eq2"],
  ["color: black; background: red;", "._1ry8j36"],
  ["color: #000;", "._djyl69"],
  ["color: yellow;", "._djyl69:before"],
  ["color: #000;", "._hzw522"],
  ["(max-width: 30em)", [["color: red;", "._hzw522"]]],
  ["(max-width: 3em)", [["color: red;", "._hzw522"]]],
  ["color: red;", "._1uxwnw8"],
  ["color: blue;", "._1uxwnw8>*"],
  [
    "(max-width: 30em)",
    [
      ["color: red;", "._1uxwnw8"],
      ["color: purple;", "._1uxwnw8>*"],
    ],
  ],
];
let ssr =
  ssrGlobal +
  ssrSelectors
    .map(([text, selector]) => {
      if (typeof selector === "string") {
        return `${selector} {${text}}`;
      } else {
        let s = selector.map(([txt, sel]) => `${sel} {${txt}}`).join("");
        return `@media ${text} {${s}}`;
      }
    })
    .join("");

const dom = new JSDOM(`<!DOCTYPE html>
<head>
    <style data-nano-css-lama>${ssr}</style>
</head>
<body>
    
</body>
</html>`);
// @ts-ignore
global.window = dom.window;
global.document = window.document;
var test = require("tape");
let { hash, getRaw, add, glob, css, reset, setup } = require("../cjs");

/**
 * @type {HTMLStyleElement}
 */
const style = document.querySelector("style");
const sheet = style.sheet;

const getRules = () => {
  let raw = "";
  for (let r of sheet.cssRules) {
    raw += r.cssText;
  }
  return raw;
};

const getLastRule = () => sheet.cssRules[sheet.cssRules.length - 1].cssText;

test("basics", (t) => {
  t.equal(style.tagName, "STYLE");
  t.equal(typeof sheet, "object");
  t.equal(getRules(), ssr);
  let last = getLastRule();
  css`
    color: #ff00ff;
  `;
  t.equal(getLastRule(), "._18s2jlm {color: #ff00ff;}");
  t.end();
});

test("don't add hydrated styles", (t) => {
  let last = getLastRule();
  let selector;
  glob`:root {--pad: 1rem;}`;
  t.equal(getLastRule(), last);
  selector = css`
    color: #000;
  `;
  t.equal(getLastRule(), last, `should be hydrated ${selector}`);
  selector = css`
    ${"color: black;background: red;"}
  `;
  t.equal(getLastRule(), last, `should be hydrated ${selector}`);
  selector = css`
    ${"color: #000;@media (max-width: 30em) { &{color:red;} }@media (max-width: 3em) { &{color:red;} }"}
  `;
  t.equal(getLastRule(), last, `should be hydrated ${selector}`);
  t.end();
});
