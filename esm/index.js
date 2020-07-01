/**
 * Hash function from https://github.com/darkskyapp/string-hash
 * as used in https://github.com/streamich/nano-css
 * Given a
 * @param {string} str The CSS string to hash
 * @returns {string} The unique class derived from the hash
 */
export const hash = (str) => {
  let hash = 5381,
    i = str.length;

  while (i) hash = (hash * 33) ^ str.charCodeAt(--i);

  return "_" + (hash >>> 0).toString(36);
};

let raw = "";
let cache = {};
let keys = {};
let hydrated = {};
/**
 * Get the raw string of all the statements added
 * @returns {string} The raw string of all the statements added
 */
export const getRaw = () => raw;

/**
 * helper function to reset raw, cache and keys
 */
export const reset = () => {
  raw = "";
  cache = {};
  keys = {};
  hydrated = {};
};

/**
 * Given a statements as a string add it to raw
 * @param {string} str The string to add
 */
export let add = (str) => {
  raw += str;
  add.insert(str);
};

add.insert = (str) => {};
add.isDev = false;

/**
 * Template literal without coercing null, undefined and false to string
 * @param {TemplateStringsArray} t
 */
function tag(t) {
  for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
    s += (arguments[i] || "") + t[i];
  return s;
}

/**
 *
 * Given a statement as a template string add it, but only once
 * Use this tag to add global CSS
 * @param {TemplateStringsArray} template
 * @param  {...any} values
 */
export let glob = (template, ...values) => {
  let str = tag(template, ...values);
  // remove comments, double or more spaces, line feed
  str = str.replace(/\/\*.*?\*\/|\s{2,}|\n/gm, "");
  if (!str) return;
  // if the str is in the cache it has been added already, there is nothing to do
  if (cache[str]) return;
  cache[str] = 1;
  add(str);
};

/**
 * Given a string with CSS declarations
 * create a ruleset, add it and return the selector
 * @param {TemplateStringsArray} template
 * @param  {...any} values
 * @returns {string}
 */
export let css = (template, ...values) => {
  let str = tag(template, ...values);

  let key = css.getKey(str);

  // remove comments, double or more spaces, line feed
  str = str.replace(/\/\*.*?\*\/|\s{2,}|\n/gm, "");

  // if str is empty or null or undefined
  // there is nothing to do.
  // return an empty string as selector
  if (!str) return "";

  // if str is in the cache it has been added already
  // just return the cached selector with a leading space
  if (cache[str]) return " " + cache[str];
  if (!key || keys[key]) {
    key = hash(str);
  }
  keys[key] = 1;
  cache[str] = key;
  if (hydrated["." + key]) return " " + key;

  let [rules, ...atRules] = str.split("@");
  if (rules) {
    let [baseRule, ...etRules] = rules.split("&");
    baseRule && add(`.${key}{${baseRule}}`);
    etRules.map((r) => add("." + key + r));
  }
  atRules.map((r) => add("@" + r.replace(/&/g, "." + key)));

  return " " + key;
};

/**
 * look for a class name in a comment at the first line
 * default to noop
 * @param {string} s
 */
css.getKey = (s) => null;

let client = typeof window === "object";
let sh = null;

if (client) {
  sh = /**@type {HTMLStyleElement} */ (document.querySelector(
    "style[data-nano-css-lama]"
  ));
  if (!sh) {
    sh = document.createElement("style");
    document.head.appendChild(sh);
    sh.setAttribute("data-nano-css-lama", "");
  } else {
    // hydrate
    for (let r of sh.sheet.cssRules) {
      let {
        selectorText,
        cssText,
        type,
      } = /**@type {CSSRule & {selectorText ?: string}} */ (r);
      if (type === 1 && selectorText !== ":root") {
        hydrated[selectorText] = 1;
      } else {
        cache[cssText] = 1;
      }
    }
  }
  let sheet = sh.sheet;
  add.insert = (str) => {
    try {
      sheet.insertRule(str, sheet.cssRules.length);
    } catch (err) {
      if (add.isDev) {
        throw err;
      } else {
        console.log(err);
      }
    }
  };
}

/**
 * Optional setup
 * @param {{getKey?: boolean, isDev?: boolean}} options
 */
export const setup = (options = {}) => {
  const { getKey, isDev } = options;
  if (isDev) {
    add.isDev = isDev;
  }
  if (getKey) {
    let r = /^\n*\s*\/\*\s*key=(\S*)\s*\*\//;
    if (isDev) {
      css.getKey = (s) => {
        let e = r.exec(s);
        if (e) {
          if (keys[e[1]]) {
            throw `Key ${e[1]} used more than once`;
          } else {
            return e[1];
          }
        }
        return null;
      };
    } else {
      css.getKey = (s) => {
        let e = r.exec(s);
        return e ? e[1] : null;
      };
    }
  }
};
