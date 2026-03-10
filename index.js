/**
 * SantyCSS — programmatic API
 *
 * const { purge, purgeFiles } = require('santycss');
 */
const { purge, purgeFiles, extractClasses, minify, EXTS } = require('./lib/purge-core');
module.exports = { purge, purgeFiles, extractClasses, minify, EXTS };
