let { getRaw, css, reset, setup } = require("../cjs");
var test = require("tape");
const { testCssRaw } = require("./helpers_nt");

setup({ getKey: true });

test("block name", (t) => {
  reset();
  testCssRaw(t, "/*key=red*/color:red;", ".red{color:red;}", " red");
  testCssRaw(t, "/* comment */color:red;", "", " red");
  testCssRaw(t, "\n/* key=blue*/color:blue;", ".blue{color:blue;}", " blue");
  css`
    color: green;
  `;
  testCssRaw(t, "/*     key=green    */color: green;", "", " _5m1q2q");
  t.throws(
    () =>
      css`
        /*key=red*/
        color: orange;
      `
  );
  // testCssRaw(t,'','','')
  t.end();
});
