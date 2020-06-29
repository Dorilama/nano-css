"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = exports.getRaw = exports.hash = void 0;

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
 * Get the raw string of all the styles added
 * @returns {string} The raw string of all the styles added
 */

const getRaw = () => raw;
/**
 * Given a string add it to raw
 * @param {string} str The string to add
 * @returns {void}
 */


exports.getRaw = getRaw;

let add = str => {
  raw += str;
};

exports.add = add;