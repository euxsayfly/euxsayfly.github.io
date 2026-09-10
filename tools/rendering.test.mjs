import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import Hexo from 'hexo';
import { load } from 'cheerio';

const hexo = new Hexo(process.cwd(), { silent: true });
await hexo.init();
after(() => hexo.exit());
const render = text => hexo.render.renderSync({ text, engine: 'md' });

test('math keeps TeX subscripts and matrix row separators intact', () => {
  const formula = String.raw`$$\begin{bmatrix}p_i\\v_i\end{bmatrix}=I_{2\times2}u_i$$`;
  const $ = load(render(formula));
  assert.equal($('.math-display').text(), formula);
  assert.equal($('.math-display em, .math-display br').length, 0);
});

test('inline math escapes HTML but does not change TeX or punctuation', () => {
  const formula = String.raw`$x_i < y_i, f'(x), 1...N$`;
  const $ = load(render(`before ${formula} after`));
  assert.equal($('.math-inline').text(), formula);
  assert.equal($('y_i').length, 0);
  assert.match($('body').text(), /^before .* after\n$/);
});

test('inline display math and multiline display math survive Markdown', () => {
  const inline = String.raw`$$L_fh(x)+L_gh(x)u$$`;
  assert.equal(load(render(`定义为${inline}。`))('.math-inline').text(), inline);
  const block = '$$\nx_i\n+y_i\n$$';
  assert.equal(load(render(block))('.math-display').text(), block);
});

test('parenthesis math delimiters survive Markdown backslash escaping', () => {
  const formula = String.raw`\(x_i + y_i\)`;
  assert.equal(load(render(formula))('.math-inline').text(), formula);
});

test('code and escaped dollars are not mistaken for equations', () => {
  const $ = load(render('`$x_i$` and \\$5\n\n```text\n$x_i$\n```'));
  assert.equal($('.math-inline, .math-display').length, 0);
  assert.equal($('code').first().text(), '$x_i$');
});

test('code examples stay text, not active HTML', () => {
  const $ = load(render('```html\n<img src="https://invalid.example/image.png">\n```'));
  assert.equal($('img').length, 0);
  assert.match($('code').text(), /<img src=/);
});

test('password-marked content fails the public build', () => {
  assert.throws(() => hexo.execFilterSync('before_post_render', {
    source: '_posts/private-fixture.md', title: 'Fixture', content: 'test fixture', password: 'fixture-only'
  }, { context: hexo }), /Exclude password-marked content/);
});
