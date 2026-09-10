import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { load } from 'cheerio';

const publicDir = path.resolve('public');
const origin = 'https://euxsayfly.github.io';
const errors = new Set();
const externalAssets = new Set();
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [path.relative(publicDir, full).replaceAll('\\', '/')];
  });
}
if (!fs.existsSync(publicDir)) throw new Error('Build the site before checking it.');
const files = walk(publicDir);
const fileSet = new Set(files);
const cssFiles = new Set();
function checkUrl(value, from, asset = false) {
  if (!value || /^(#|data:|mailto:|tel:|javascript:)/i.test(value)) return;
  let url;
  try { url = new URL(value, `${origin}/${from}`); }
  catch { errors.add(`${from}: invalid URL ${value}`); return; }
  if (url.origin !== origin) {
    if (asset) {
      externalAssets.add(url.hostname);
      if (url.protocol !== 'https:') errors.add(`${from}: non-HTTPS asset ${value}`);
      if (/cdn\.bootcss\.com|cdn\.staticfile\.org/.test(url.hostname)) errors.add(`${from}: retired CDN ${value}`);
    }
    return;
  }
  const local = decodeURIComponent(url.pathname).replace(/^\//, '');
  const target = [local, local + 'index.html', local + '/index.html'].find(p => fileSet.has(p));
  if (!target) errors.add(`${from}: missing local target ${url.pathname}`);
  else if (target.endsWith('.css')) cssFiles.add(target);
}

for (const name of ['index.html', '404.html', '.nojekyll', 'search.xml', 'atom.xml', 'sitemap.xml']) {
  if (!fileSet.has(name)) errors.add(`Missing entrypoint: ${name}`);
}
const legacy = JSON.parse(fs.readFileSync('tools/legacy-routes.json', 'utf8'));
for (const route of legacy) if (!fileSet.has(route)) errors.add(`Changed legacy article URL: ${route}`);
if (files.some(f => /\/test\//.test(f))) errors.add('The private test article was published.');

for (const file of files.filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(publicDir, file), 'utf8');
  const $ = load(html);
  if (!$('title').text().trim()) errors.add(`${file}: empty title`);
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical || decodeURI(new URL(canonical).href) !== `${origin}/${file.replace(/index\.html$/, '')}`) {
    errors.add(`${file}: incorrect canonical URL`);
  }
  $('a[href], link[href]').each((_, element) => checkUrl($(element).attr('href'), file, element.tagName === 'link' && $(element).attr('rel') === 'stylesheet'));
  $('[src], [poster], [data-src]').each((_, element) => {
    for (const attr of ['src', 'poster', 'data-src']) checkUrl($(element).attr(attr), file, true);
  });
  $('[style]').each((_, element) => {
    for (const match of $(element).attr('style').matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) checkUrl(match[1], file, true);
  });
  $('script:not([src])').each((_, element) => {
    const type = $(element).attr('type');
    if (type && !['text/javascript', 'application/javascript'].includes(type)) return;
    try { new vm.Script($(element).html(), { filename: file }); }
    catch (error) { errors.add(`${file}: inline JavaScript: ${error.message}`); }
  });
  if (/saysomewy\.com|http:\/\/example\.com/.test(html)) errors.add(`${file}: obsolete site URL`);
}

// Inspect the CSS actually loaded by pages, including its font and image files.
for (const file of cssFiles) {
  const css = fs.readFileSync(path.join(publicDir, file), 'utf8');
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) checkUrl(match[1], file, true);
}
for (const name of ['search.xml', 'sitemap.xml', 'atom.xml']) {
  if (!fileSet.has(name)) continue;
  const xml = fs.readFileSync(path.join(publicDir, name), 'utf8');
  const $ = load(xml, { xml: true });
  $('loc, entry > url').each((_, el) => checkUrl($(el).text(), name));
  $('entry > link[href]').each((_, el) => checkUrl($(el).attr('href'), name));
  if (/\/test\/|saysomewy\.com|example\.com/.test(xml)) errors.add(`${name}: private or obsolete URL`);
  if (name === 'search.xml' && $('entry').length < legacy.length) errors.add('Search is missing articles.');
}
if (errors.size) {
  console.error([...errors].join('\n'));
  console.error(`Site validation failed: ${errors.size} issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${files.filter(f => f.endsWith('.html')).length} HTML pages, ${legacy.length} legacy article URLs, local assets, search, feed, sitemap, and 404.`);
  console.log(`External asset hosts (availability not validated): ${[...externalAssets].sort().join(', ')}`);
}
