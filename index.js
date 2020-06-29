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
   * Use this tag to add global CSS
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
   * look for a class name in a comment at the first line
   * default is a noop
   * @param {string} s
   */
  let lookForName = (s) => {
    let [$0, $1, $2] = /^\/\*(.*)\*\/|^\n\/\*(.*)\*\//.exec(s) || [];
    console.log("###########", s, $1, $2);
    return $1 || $2;
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
    let key = lookForName(str);

    // remove comments, double or more spaces, line feed
    str = str.replace(/\/\*.*?\*\/|\s{2,}|\n/gm, "");

    // if str is in the cache it has been added already
    // just return the cached selector with a leading space
    if (cache[str]) return " " + cache[str];
    key = key || hash(str);
    cache[str] = key;

    /**
     * The big assumtion here is the order of the statements
     * - First: declarations of the basic ruleset to be applied
     *   with the basic class selector witout braces to delimit the block.
     * - Second: rulesets with combinators, pseudo classes
     *   and pseudo elements. Use the ampersand "&" to refer
     *   to the current class selector.
     *   Use braces to delimit the blocks.
     * - Third: at-rules statements. Use the ampersand "&"
     *   to refer to the current class selector.
     *   Use braces to delimit the blocks,
     *   also for ruleset to be applied with the basic class selector.
     *
     * I.e. css`color: red;
     * background: yellow;
     * & > *{
     * color: purple;
     * }
     * &:hover{
     * color: #fff;
     * }
     * &::before{
     * color:black;
     * }
     * @media (max-width: 30em) {
     * &{color:red;}
     * &:hover{color:blue;}
     * }
     * @supports (display: flex) {
     * & { display: flex; }
     * }
     * `
     */
    //
    // - First: declarations of the basic ruleset directly
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
   * helper function to reset raw and cache
   */
  const reset = () => {
    raw = "";
    cache = [];
  };

  exports.add = add;
  exports.css = css;
  exports.getRaw = getRaw;
  exports.glob = glob;
  exports.hash = hash;
  exports.reset = reset;

  return exports;

}({}).default);
