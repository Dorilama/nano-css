CSS in Js inspired by [nano-css](https://github.com/streamich/nano-css).

![Travis (.com)](https://img.shields.io/travis/com/Dorilama/nano-css) ![Coveralls github](https://img.shields.io/coveralls/github/Dorilama/nano-css) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/@dorilama/nano-css) ![David](https://img.shields.io/david/Dorilama/nano-css)

---

## Disclaimer

This is a demo project for learning purposes.

---

Live example [here](https://codepen.io/dorilama/pen/oNboJxB)

Currently it produces class names, a raw CSS string and injects the styles in the page.

It also support ssr hydration.

It doesn't parse the declarations and it doesn't autoprefix the styles.

It is mainly a learning project.

---

## Usage

```javascript
import { glob, css, getRaw, reset, setup } from "./esm";

// add global CSS statement
glob`
:root{
    --pad: 1rem;
}
`;

// get the raw CSS string of all the statements added
// remove comments, double or more spaces and line feed
console.log(getRaw());
// expected output : ":root{--pad: 1rem;}"

// add the same statement only once
glob`
/* some comment */
:root{--pad: 1rem;
}
`;
console.log(getRaw());
// expected output : ":root{--pad: 1rem;}"

let undefinedDeclaration;
let nullRule = null;
// null and undefined values are not coerced
glob`
${nullRule}
h1{
    color: red;
    ${undefinedDeclaration}
    }
    `;
console.log(getRaw());
// expected output : ":root{--pad: 1rem;}h1{color: red;}"

// reset the raw string, and the cache
reset();

console.log(getRaw());
// expected output : ""

// add CSS rules and return a hash of the rule used as class name
// the hash is the same used in nano-css https://github.com/streamich/nano-css
// more info at string-hash https://github.com/darkskyapp/string-hash
// TL;DR is similar to djb2, by Dan Bernstein http://www.cse.yorku.ca/~oz/hash.html
// the final class name is a string representing the hash number
// with a leading underscore
let className = css`
  color: yellow;
`;
console.log(className);
// expected output : " _10nr3st"
// the return value of css has always a leading space
// to ease concatenation of classes
console.log(getRaw());
// expected output : "._10nr3st{color: yellow;}"
```

The big assumtion here is the order of the statements

1. Declarations of the basic ruleset to be applied with the basic class selector witout braces to delimit the block.
2. Rulesets with combinators, pseudo classes and pseudo elements. Use the ampersand "&" to refer to the current class selector. Use braces to delimit the blocks.
3. At-rules statements. Use the ampersand "&" to refer to the current class selector. Use braces to delimit the blocks, also for ruleset to be applied with the basic class selector.

I.e.

```javascript
css`
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
  @media only screen and (max-width: 30em) {
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
`;
```

will produce

```css
._bb2r2n {
  color: red;
  background: yellow;
}
._bb2r2n > * {
  color: purple;
}
._bb2r2n:hover {
  color: #fff;
}
._bb2r2n::before {
  color: black;
}
@media only screen and (max-width: 30em) {
  ._bb2r2n {
    color: red;
  }
  ._bb2r2n:hover {
    color: blue;
  }
}
@supports (display: flex) {
  ._bb2r2n {
    display: flex;
  }
}
```

We can add a comment before the declarations to specify a class name to use in the statement instead of the generated hash. The comment is in the form `/* key=classname */`. The class name is not modified so it must be a valid class name.
To use the comment class we need to call `setup` with the `getKey` option set to true.
I.e.

```javascript
setup({ getKey: true });
css`
  /*key=green*/
  color: green;
`;
console.log(getRaw());
// expected output: ".green{color: green;}"
```

If the same statement is already in the cache with another class name the returned class will be the one in the cache.
I.e.

```javascript
css`
  color: red;
`;
let className = css`
  /*key=red*/
  color: red;
`;
console.log(className);
// expected output: " _gq0ykq"
```

Styles are cached after stripping comments, double or more spaces and line feed. Single spaces are kept.
I.e.

```javascript
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
console.log(c1 === c2); // true
console.log(c1 === c3); // false - there is no space between ":" and "red"
console.log(c1 === c4); // false - the semicolon is missing
```

Ssr hydration is automatic and targets a `style` element with `data-nano-css-lama` attribute.

The `glob` and `css` template literal tags don't coerce `null`, `undefined` and `false` to string. Theese values get replaced by an empty string.

## Security

**This library allow to use arbitrary input as interpolations. User input used as style can lead to CSS injection.**
Read [here](https://frontarm.com/james-k-nelson/how-can-i-use-css-in-js-securely/) to have an idea of the problem.
