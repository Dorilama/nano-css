let { getRaw, css, reset, setup } = require("../cjs");
var test = require("tape");

setup({ getKey: true });

const testCssRaw = (
  t,
  value,
  expectedValue,
  expectedSelector,
  message = ""
) => {
  let currentRaw = getRaw();
  let selector = css`
    ${value}
  `;
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
