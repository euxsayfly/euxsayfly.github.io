'use strict';

const { escapeHTML } = require('hexo-util');

// Leave TeX intact for MathJax: Markdown must not consume underscores,
// matrix line breaks, angle brackets, or backslashes inside equations.
hexo.extend.filter.register('marked:extensions', extensions => {
  extensions.push({
    name: 'mathBlock',
    level: 'block',
    start: source => source.match(/(?:^|\n) {0,3}\$\$/)?.index,
    tokenizer(source) {
      const match = /^ {0,3}\$\$([\s\S]+?)\$\$[ \t]*(?:\n|$)/.exec(source);
      if (match) return { type: 'mathBlock', raw: match[0], text: `$$${match[1]}$$` };
    },
    renderer: token => `<div class="math-display">${escapeHTML(token.text)}</div>\n`
  }, {
    name: 'mathInline',
    level: 'inline',
    start: source => source.match(/\$|\\\(/)?.index,
    tokenizer(source) {
      const match = /^(?:\$\$(?:\\[^\n]|[^\\$])+?\$\$|\$(?!\$)(?:\\[^\n]|[^\\$\n])+?\$(?!\$)|\\\((?:\\[^\n]|[^\\\n])+?\\\))/.exec(source);
      if (match) return { type: 'mathInline', raw: match[0], text: match[0] };
    },
    renderer: token => `<span class="math-inline">${escapeHTML(token.text)}</span>`
  });
});
