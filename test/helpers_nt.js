let { getRaw, css } = require("../cjs");

/**
 *
 * @param {import('tape').Test} t
 * @param {undefined|null|string} value
 * @param {string} expectedValue
 * @param {string} expectedSelector
 * @param {string} [message]
 */
exports.testCssRaw = (
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
