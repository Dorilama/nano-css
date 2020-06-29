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

  let raw = "";

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
  let add = (str) => {
    raw += str;
  };

  exports.add = add;
  exports.getRaw = getRaw;
  exports.hash = hash;

  return exports;

}({}).default);
