/* eslint-env node */

'use strict';

const extend = require('../lib/deepExtend');
const { flatten, map } = require('lodash');
const { allConfigFiles, allFiles } = require('../lib/gruntSources');

const srcExt = { 'src/ext': 'build/src/ext' };
const srcTestExt = { 'srcTest/ext': 'build/srcTest/ext' };

/**
 * @param {IGrunt} grunt
 * @returns {object} configuration for `copy` task
 */
module.exports = function (grunt) {
  const copyConfig = grunt.config.getRaw('copy') || {};
  const babelConfig = grunt.config.getRaw('babel') || {};

  const {
    source = { 'build/src/rc': 'src/rc' },
    test = { 'build/srcTest/rc': 'srcTest/rc' }
  } = babelConfig;

  return extend({
    dist: {
      files: flatten([
        toDistFolder(source, allConfigFiles()),
        toDistFolder(test, allConfigFiles()),
        toDistFolder(srcExt, allFiles()),
        toDistFolder(srcTestExt, allFiles())
      ])
    },
    karma: {
      files: flatten([
        toKarmaFolder(source, allConfigFiles()),
        toKarmaFolder(test, allConfigFiles()),
        toKarmaFolder(srcExt, allFiles()),
        toKarmaFolder(srcTestExt, allFiles())
      ])
    }
  }, copyConfig);
};

/**
 * @param {object} dirMap dest dir -> source dir mapping
 * @param {object} gruntSrc
 * @returns {Array.<object>} Grunt file config objects
 */
function toDistFolder(dirMap, gruntSrc) {
  return map(dirMap, (src, dest) => gruntSrc.from(src).to(dest));
}

/**
 * @param {object} dirMap dest dir -> source dir mapping
 * @param {object} gruntSrc
 * @returns {Array.<object>} Grunt file config objects
 */
function toKarmaFolder(dirMap, gruntSrc) {
  return map(dirMap, (src, dest) => gruntSrc.from(src).toKarma(dest));
}
