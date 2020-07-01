const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html>
<head>
    <style data-nano-css-lama></style>
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

// const testInsert()

test("basics", (t) => {
  t.equal(style.tagName, "STYLE");
  t.equal(typeof sheet, "object");
  t.end();
});
