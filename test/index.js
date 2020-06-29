let { hash, getRaw, add } = require("../cjs");
var test = require("tape");

// hash test from https://github.com/darkskyapp/string-hash
test("hash test", (t) => {
  t.equal(
    hash("Mary had a little lamb."),
    "_" + (1766333550 >>> 0).toString(36),
    `hash "Mary had a little lamb."`
  );
  t.equal(
    hash("Hello, world!"),
    "_" + (343662184 >>> 0).toString(36),
    `hash "Hello, world!"`
  );
  t.end();
});

test("basic add", (t) => {
  t.equal(getRaw(), "", "initial raw");
  add("hello");
  t.equal(getRaw(), "hello", 'add "hello"');
  add(" world");
  t.equal(getRaw(), "hello world", 'add " world"');
  t.end();
});
