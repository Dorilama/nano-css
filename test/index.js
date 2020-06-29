let { hash, getRaw, add, glob, css } = require("../cjs");
var test = require("tape");
/**
 *
 * @param {import('tape').Test} t
 * @param {undefined|null|string} value
 * @param {string} expectedValue
 * @param {selector} expectedSelector
 * @param {string} [message]
 */
const testCssRaw = (
  t,
  value,
  expectedValue,
  expectedSelector,
  message = ""
) => {
  let currentRaw = getRaw();
  let selector = css(["", ""], value);
  t.equal(
    getRaw(),
    currentRaw + expectedValue,
    `css raw - "${value}"${message ? " - " + message : ""}`
  );
  t.equal(
    selector,
    expectedSelector,
    `css selector - "${value}"${message ? " - " + message : ""}`
  );
};

// hash test from https://github.com/darkskyapp/string-hash
test("hash test", (t) => {
  t.equal(
    hash("Mary had a little lamb."),
    "_" + (1766333550 >>> 0).toString(36),
    `hash "Mary had a little lamb."`
  );
  t.equal(
    hash("Hello, world!"),
    "_" + (343662184 >>> 0).toString(36),
    `hash "Hello, world!"`
  );
  t.end();
});

test("basic add", (t) => {
  t.equal(getRaw(), "", "initial raw");
  add("hello");
  t.equal(getRaw(), "hello", 'add "hello"');
  add(" world");
  t.equal(getRaw(), "hello world", 'add " world"');
  t.end();
});

test("basic glob", (t) => {
  let currentRaw = getRaw();
  glob``;
  t.equal(getRaw(), currentRaw, `glob null`);
  glob`${null}`;
  t.equal(getRaw(), currentRaw, `glob undefined`);
  glob`${undefined}`;
  t.equal(getRaw(), currentRaw, `glob ""`);
  glob`hello `;
  t.equal(getRaw(), currentRaw + "hello ", `glob "hello "`);
  glob`hello${" "}`;
  t.equal(getRaw(), currentRaw + "hello ", `glob "hello " again`);
  glob`world`;
  t.equal(getRaw(), currentRaw + "hello " + "world", `glob "world"`);
  glob`hello `;
  t.equal(getRaw(), currentRaw + "hello " + "world", `glob "hello " again 2`);
  t.end();
});

test("basic css", (t) => {
  testCssRaw(t, "", "", "");
  testCssRaw(t, null, "", "");
  testCssRaw(t, undefined, "", "");
  testCssRaw(t, "color: #000;", "._4e6eq2{color: #000;}", " _4e6eq2");
  testCssRaw(t, "color: #000;", "", " _4e6eq2", "again");
  testCssRaw(
    t,
    "color: black;background: red;",
    "._1ry8j36{color: black;background: red;}",
    " _1ry8j36"
  );
  testCssRaw(t, "color: #000;", "", " _4e6eq2", "again 2");
  // testCssRaw(t,'','','')
  // testCssRaw(t,'','','')
  t.end();
});
