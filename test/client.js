const { JSDOM } = require("jsdom");
const dom = new JSDOM(``);
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

/**
 *
 * @param {import('tape').Test} t
 * @param {string} value
 * @param {*} expected
 */
const testCss = (t, value, expected) => {
  css`
    ${value}
  `;
  expected.reverse().forEach((e, i) => {
    let rule = sheet.cssRules[sheet.cssRules.length - 1 - i];
    switch (rule.type) {
      case 1:
        let {
          style: { cssText },
          selectorText,
        } = /** @type {CSSStyleRule}*/ (rule);
        let [text, selector] = e;

        t.equal(cssText, text, `css "${value}" - cssText`);
        t.equal(selectorText, selector, `css "${value}" - selectorText`);
        // console.log(1, e);
        break;
      case 4:
        let {
          media: { mediaText },
          cssRules,
        } = /** @type {CSSMediaRule}*/ (rule);
        let [media, ruleList] = e;
        t.equal(mediaText, media);
        ruleList.forEach((r, i) => {
          let {
            style: { cssText },
            selectorText,
          } = /** @type {CSSStyleRule}*/ (cssRules[i]);
          let [text, selector] = r;
          t.equal(cssText, text, `css "${value}"- ${media} - cssText`);
          t.equal(
            selectorText,
            selector,
            `css "${value}"- ${media} - selectorText`
          );
        });
        break;
      default:
        throw `type ${rule.type} not handled in testCss`;
    }
  });
};

test("basics", (t) => {
  t.equal(style.tagName, "STYLE");
  t.equal(typeof sheet, "object");
  t.end();
});

test("add.insert", (t) => {
  add(":root{--pad:1rem;}");
  t.equal(getRules(), ":root {--pad: 1rem;}");
  add("h1{color:red}");
  t.equal(getRules(), ":root {--pad: 1rem;}h1 {color: red;}");
  add("h1");
  setup({ isDev: true });
  t.throws(() => add("h1"));
  t.end();
});

test("glob", (t) => {
  let lastRule = getLastRule();
  glob``;
  t.equal(getLastRule(), lastRule);
  glob`${null}`;
  t.equal(getLastRule(), lastRule);
  glob`${undefined}`;
  t.equal(getLastRule(), lastRule);
  glob`:root{--pad:1rem;}`;
  t.equal(getLastRule(), ":root {--pad: 1rem;}");
  let rules = getRules();
  glob`:root{--pad:1rem;}`;
  t.equal(getRules(), rules);
  glob`   /* comment */  :root{--pad:2rem;/*comment*/}`;
  t.equal(getLastRule(), ":root {--pad: 2rem;}");
  t.end();
});

test("css", (t) => {
  let lastRule = getLastRule();
  css``;
  t.equal(getLastRule(), lastRule);
  css`
    ${null}
  `;
  t.equal(getLastRule(), lastRule);
  css`
    ${undefined}
  `;
  t.equal(getLastRule(), lastRule);
  testCss(t, "color: #000;", [["color: #000;", "._4e6eq2"]]);
  let rules = getRules();
  css`
    color: #000;
  `;
  t.equal(getRules(), rules);
  testCss(t, "color: black;background: red;", [
    ["color: black; background: red;", "._1ry8j36"],
  ]);
  testCss(t, `color: #000;&:before{color:yellow;}`, [
    ["color: #000;", "._djyl69"],
    ["color: yellow;", "._djyl69:before"],
  ]);
  testCss(t, `&:before{color:purple;}`, [
    ["color: purple;", "._1kc5304:before"],
  ]);
  testCss(t, `color: #000;@media (max-width: 30em) { &{color:red;} }`, [
    ["color: #000;", "._12l4pns"],
    ["(max-width: 30em)", [["color: red;", "._12l4pns"]]],
  ]);
  testCss(
    t,
    `color: #000;@media (max-width: 30em) { &{color:red;} }@media (max-width: 3em) { &{color:red;} }`,
    [
      ["color: #000;", "._hzw522"],
      ["(max-width: 30em)", [["color: red;", "._hzw522"]]],
      ["(max-width: 3em)", [["color: red;", "._hzw522"]]],
    ]
  );
  testCss(t, `@media (max-width: 30em) { &{color:red;} }`, [
    ["(max-width: 30em)", [["color: red;", "._1e2mo6f"]]],
  ]);
  testCss(
    t,
    `color:red;&>*{color:blue;}@media (max-width: 30em) { &{color:red;} }`,
    [
      ["color: red;", "._2nsavy"],
      ["color: blue;", "._2nsavy>*"],
      ["(max-width: 30em)", [["color: red;", "._2nsavy"]]],
    ]
  );
  testCss(
    t,
    `color:red;&>*{color:blue;}&>p{color:blue;}@media (max-width: 30em) { &{color:red;} }@media (max-width: 3em) { &{color:red;} }`,
    [
      ["color: red;", "._19tl7r4"],
      ["color: blue;", "._19tl7r4>*"],
      ["color: blue;", "._19tl7r4>p"],
      ["(max-width: 30em)", [["color: red;", "._19tl7r4"]]],
      ["(max-width: 3em)", [["color: red;", "._19tl7r4"]]],
    ]
  );
  testCss(t, `&>*{color:blue;}@media (max-width: 30em) { &{color:red;} }`, [
    ["color: blue;", "._17krno1>*"],
    ["(max-width: 30em)", [["color: red;", "._17krno1"]]],
  ]);
  testCss(
    t,
    `color:red;&>*{color:blue;}@media (max-width: 30em) { &{color:red;} &>*{color:purple;} }`,
    [
      ["color: red;", "._1uxwnw8"],
      ["color: blue;", "._1uxwnw8>*"],
      [
        "(max-width: 30em)",
        [
          ["color: red;", "._1uxwnw8"],
          ["color: purple;", "._1uxwnw8>*"],
        ],
      ],
    ]
  );
  // testCss(t, ``, [["", "."],["", "."]]);
  // testCss(t, ``, [["", "."],["", "."]]);
  // testCss(t, ``, [["", "."]]);
  t.end();
});
