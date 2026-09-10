import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const context = vm.createContext({});
vm.runInContext(fs.readFileSync('themes/matery/source/js/search.js', 'utf8'), context);

test('search treats regex punctuation as ordinary text', () => {
  const result = context.highlightSearchText('CBF (x) [u] a+b', ['(', '[u]', 'a+b']);
  assert.match(result, /<em class="search-keyword">\(<\/em>/);
  assert.match(result, /<em class="search-keyword">\[u\]<\/em>/);
  assert.match(result, /<em class="search-keyword">a\+b<\/em>/);
});

test('search escapes markup and preserves original casing', () => {
  const result = context.highlightSearchText('<img src="x"> CBF & CLF', ['img', 'cbf']);
  assert.ok(!result.includes('<img'));
  assert.match(result, /&lt;/);
  assert.match(result, /&quot;x&quot;/);
  assert.match(result, /<em class="search-keyword">CBF<\/em>/);
  assert.match(result, /&amp;/);
  assert.equal(context.escapeSearchHtml("a'b"), 'a&#39;b');
});

test('empty keywords do not create zero-length highlight matches', () => {
  assert.equal(context.highlightSearchText('Hello <world>', ['', '']), 'Hello &lt;world&gt;');
});
