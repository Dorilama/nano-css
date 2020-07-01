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

// const testInsert()

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
  console.log(getRules());
  t.end();
});
