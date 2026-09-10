'use strict';

const { slugify } = require('transliteration');
const legacyRoutes = require('../tools/legacy-routes.json');
const compact = value => value.toLowerCase().replaceAll('-', '');
const legacyPaths = new Map(legacyRoutes.map(route => {
  const permalink = route.replace(/index\.html$/, '');
  return [compact(permalink), permalink];
}));

// Keep the original date + pinyin URLs with a maintained transliterator.
hexo.extend.filter.register('post_permalink', function (path) {
  const options = this.config.permalink_pinyin;
  if (!options || !options.enable) return path;
  const converted = slugify(path, { ...options, ignore: ['/', '.'] });
  // Version 2 treats Chinese parentheses and Latin/Chinese boundaries differently.
  // Restore the exact historical path for every existing article and its assets.
  return legacyPaths.get(compact(converted)) || path.split('/').map(part => slugify(part, options)).join('/');
});

// The old password prompt did not encrypt the generated article.
hexo.extend.filter.register('before_post_render', function (data) {
  if (data.password) {
    throw new Error(`Exclude password-marked content from public builds: ${data.source}`);
  }
  return data;
}, 1);
