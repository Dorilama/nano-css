"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.glob = exports.add = exports.getRaw = exports.hash = void 0;

/**
 * Hash function from https://github.com/darkskyapp/string-hash
 * as used in https://github.com/streamich/nano-css
 * Given a
 * @param {string} str The CSS string to hash
 * @returns {string} The unique class derived from the hash
 */
const hash = str => {
  let hash = 5381,
      i = str.length;

  while (i) hash = hash * 33 ^ str.charCodeAt(--i);

  return "_" + (hash >>> 0).toString(36);
};

exports.hash = hash;
const client = typeof window === "object";
let raw = "",
    cache = {},
    sh;
/**
 * Get the raw string of all the statements added
 * @returns {string} The raw string of all the statements added
 */

const getRaw = () => raw;
/**
 * Given a statements as a string add it to raw
 * @param {string} str The string to add
 */


exports.getRaw = getRaw;

let add = str => {
  raw += str;
};
/**
 * Given a statement as a string add it, but only once
 * @param {string} str
 */


exports.add = add;

let glob = str => {
  // if ampty string or null or undefined there is nothing to do
  if (!str) return;
  let key = hash(str); // if the hash of str is in the cache it has been added already, there is nothing to do

  if (cache[key]) return;
  cache[key] = true;
  add(str);
};

exports.glob = glob;