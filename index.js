var nanoCss = (function (exports) {
  'use strict';

  /**
   * Hash function from https://github.com/darkskyapp/string-hash
   * as used in https://github.com/streamich/nano-css
   * Given a
   * @param {string} str The CSS string to hash
   * @returns {string} The unique class derived from the hash
   */
  const hash = (str) => {
    let hash = 5381,
      i = str.length;

    while (i) hash = (hash * 33) ^ str.charCodeAt(--i);

    return "_" + (hash >>> 0).toString(36);
  };

  let raw = "",
    cache = {};

  /**
   * Get the raw string of all the statements added
   * @returns {string} The raw string of all the statements added
   */
  const getRaw = () => raw;

  /**
   * Given a statements as a string add it to raw
   * @param {string} str The string to add
   */
  let add = (str) => {
    raw += str;
  };

  /**
   * Template literal without coercing null, undefined and false to string
   * @param {TemplateStringsArray} t
   */
  function tag(t) {
    for (var s = t[0], i = 1, l = arguments.length; i < l; i++)
      s += arguments[i] || "" + t[i];
    return s;
  }

  /**
   *
   * Given a statement as a template string add it, but only once
   * @param {TemplateStringsArray} template
   * @param  {...any} values
   */
  let glob = (template, ...values) => {
    let str = tag(template, ...values);
    // if the str is in the cache it has been added already, there is nothing to do
    if (cache[str]) return;
    cache[str] = true;
    add(str);
  };

  /**
   * Given a string with CSS declarations
   * create a ruleset, add it and return the selector
   * @param {TemplateStringsArray} template
   * @param  {...any} values
   * @returns {string}
   */
  let css = (template, ...values) => {
    let str = tag(template, ...values);
    // if str is empty or null or undefined
    // there is nothing to do.
    // return an empty string as selector
    if (!str) return "";
    // if str is in the cache it has been added already
    // just return the cached selector with a leading space
    if (cache[str]) return " " + cache[str];
    let key = hash(str);
    cache[str] = key;
    let ruleset = `.${key}{${str}}`;
    add(ruleset);

    return " " + key;
  };

  exports.add = add;
  exports.css = css;
  exports.getRaw = getRaw;
  exports.glob = glob;
  exports.hash = hash;

  return exports;

}({}).default);
