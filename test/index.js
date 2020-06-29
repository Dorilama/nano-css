let { hash, getRaw, add, glob, css, reset } = require("../cjs");
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
  reset();
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
  reset();
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
  t.end();
});

test("pseudo", (t) => {
  reset();
  testCssRaw(
    t,
    "color: #000;&:before{color:yellow;}",
    "._djyl69{color: #000;}._djyl69:before{color:yellow;}",
    " _djyl69"
  );
  testCssRaw(
    t,
    "color: #fff;&:before{color:yellow;}",
    "._lqb413{color: #fff;}._lqb413:before{color:yellow;}",
    " _lqb413"
  );
  testCssRaw(t, "color: #fff;&:before{color:yellow;}", "", " _lqb413", "again");
  testCssRaw(
    t,
    "color: #000;&:before{color:green;}",
    "._1np40ry{color: #000;}._1np40ry:before{color:green;}",
    " _1np40ry"
  );
  testCssRaw(
    t,
    "&:before{color:purple;}",
    "._1kc5304:before{color:purple;}",
    " _1kc5304"
  );
  // testCssRaw(t,'','','')
  t.end();
});

test("at-rules", (t) => {
  reset();
  testCssRaw(
    t,
    "color: #000;@media (max-width: 30em) { &{color:red;} }",
    "._12l4pns{color: #000;}@media (max-width: 30em) { ._12l4pns{color:red;} }",
    " _12l4pns"
  );
  testCssRaw(
    t,
    "color: #000;@media (max-width: 30em) { &{color:red;} }@media (max-width: 3em) { &{color:red;} }",
    "._hzw522{color: #000;}@media (max-width: 30em) { ._hzw522{color:red;} }@media (max-width: 3em) { ._hzw522{color:red;} }",
    " _hzw522"
  );
  testCssRaw(
    t,
    "@media (max-width: 30em) { &{color:red;} }",
    "@media (max-width: 30em) { ._1e2mo6f{color:red;} }",
    " _1e2mo6f"
  );
  // testCssRaw(t,'','','')
  t.end();
});

test("pseudo and at-rules", (t) => {
  reset();
  testCssRaw(
    t,
    "color:red;&>*{color:blue;}@media (max-width: 30em) { &{color:red;} }",
    "._2nsavy{color:red;}._2nsavy>*{color:blue;}@media (max-width: 30em) { ._2nsavy{color:red;} }",
    " _2nsavy"
  );
  testCssRaw(
    t,
    "color:red;&>*{color:blue;}&>p{color:blue;}@media (max-width: 30em) { &{color:red;} }@media (max-width: 3em) { &{color:red;} }",
    "._19tl7r4{color:red;}._19tl7r4>*{color:blue;}._19tl7r4>p{color:blue;}@media (max-width: 30em) { ._19tl7r4{color:red;} }@media (max-width: 3em) { ._19tl7r4{color:red;} }",
    " _19tl7r4"
  );
  testCssRaw(
    t,
    "&>*{color:blue;}@media (max-width: 30em) { &{color:red;} }",
    "._17krno1>*{color:blue;}@media (max-width: 30em) { ._17krno1{color:red;} }",
    " _17krno1"
  );
  // testCssRaw(t,'','','')
  t.end();
});
