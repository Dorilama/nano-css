let { getRaw, glob, css, reset, setup } = require("../cjs");
var test = require("tape");
const { testCssRaw } = require("./helpers_nt");

setup({ getKey: true });

test("readme examples", (t) => {
  reset();
  glob`
    :root{
        --pad: 1rem;
    }
    `;
  t.equal(getRaw(), ":root{--pad: 1rem;}");
  glob`
    /* some comment */
    :root{--pad: 1rem;
    }
    `;
  t.equal(getRaw(), ":root{--pad: 1rem;}");
  let undefinedDeclaration;
  let nullRule = null;
  glob`
    ${nullRule}
    h1{
        color: red;
        ${undefinedDeclaration}
        }
        `;
  t.equal(getRaw(), ":root{--pad: 1rem;}h1{color: red;}");
  testCssRaw(
    t,
    `
  color: yellow;
`,
    "._10nr3st{color: yellow;}",
    " _10nr3st"
  );
  reset();
  testCssRaw(
    t,
    `
    color: red;
    background: yellow;
    & > * {
      color: purple;
    }
    &:hover {
      color: #fff;
    }
    &::before {
      color: black;
    }
    @media (max-width: 30em) {
      & {
        color: red;
      }
      &:hover {
        color: blue;
      }
    }
    @supports (display: flex) {
      & {
        display: flex;
      }
    }
  `,
    "._129w8u4{color: red;background: yellow;}._129w8u4 > * {color: purple;}._129w8u4:hover {color: #fff;}._129w8u4::before {color: black;}@media (max-width: 30em) {._129w8u4 {color: red;}._129w8u4:hover {color: blue;}}@supports (display: flex) {._129w8u4 {display: flex;}}",
    " _129w8u4"
  );
  reset();
  testCssRaw(
    t,
    `
  /*key=green*/
  color: green;
`,
    ".green{color: green;}",
    " green"
  );
  css`
    color: red;
  `;
  testCssRaw(
    t,
    `
  /*key=red*/
  color: red;
`,
    "",
    " _gq0ykq"
  );
  reset();
  let c1 = css`
    color: red;
  `;
  let c2 = css`
    /*comment*/
    color: red;
    /*comment*/
  `;
  let c3 = css`
    ${"color:red;"}
  `;
  let c4 = css`
    ${"color:red"}
  `;
  t.equal(c1, c2);
  t.notEqual(c1, c3);
  t.notEqual(c1, c4);
  t.end();
});
