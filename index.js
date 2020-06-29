var nanoCss = (function (exports) {
  'use strict';

  // Hash function from https://github.com/darkskyapp/string-hash
  const hash = (str) => {
    let hash = 5381,
      i = str.length;

    while (i) hash = (hash * 33) ^ str.charCodeAt(--i);

    return "_" + (hash >>> 0).toString(36);
  };

  exports.hash = hash;

  return exports;

}({}).default);
