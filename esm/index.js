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

const client = typeof window === "object";

let raw = "",
  cache = {},
  sh;

/**
 * Get the raw string of all the statements added
 * @returns {string} The raw string of all the statements added
 */
export const getRaw = () => raw;

/**
 * Given a statements as a string add it to raw
 * @param {string} str The string to add
 */
export let add = (str) => {
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
export let glob = (template, ...values) => {
  let str = tag(template, ...values);
  let key = hash(str);
  // if the hash of str is in the cache it has been added already, there is nothing to do
  if (cache[key]) return;
  cache[key] = true;
  add(str);
};
