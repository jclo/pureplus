#!/usr/bin/env node
/* *****************************************************************************
 *
 * Copies extra files to production.
 *
 * build:extra:prod.js script copies extra files like fonts, images, vendor
 * into the production folder.
 *
 * Private Functions:
 *  . _help                       displays the help message,
 *  . _clean                      removes the previous build,
 *  . _cpimg                      copies the image files,
 *
 *
 * Public Static Methods:
 *  . run                         executes the script,
 *
 *
 * @namespace    -
 * @dependencies none
 * @exports      -
 * @author       -
 * @since        0.0.0
 * @version      -
 * ************************************************************************** */
/* eslint one-var: 0, semi-style: 0, no-underscore-dangle: 0,
  import/no-extraneous-dependencies: 0 */

'use strict';

// -- Vendor Modules
const fs   = require('fs')
    , nopt = require('nopt')
    ;


// -- Local Modules
const config = require('./config')
    ;


// -- Local Constants
const VERSION = '0.0.0-alpha.0'
    , opts = {
      help: [Boolean, false],
      version: [String, null],
    }
    , shortOpts = {
      h: ['--help'],
      v: ['--version', VERSION],
    }
    , parsed = nopt(opts, shortOpts, process.argv, 2)
    , { root } = config
    , { dist } = config
    ;


// -- Local Variables


// -- Private Functions --------------------------------------------------------

/**
 * Dispays the help message.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
function _help() {
  const message = ['',
    'Usage: command [options]',
    '',
    '                       copies extra files(s) to production',
    '',
    'Options:',
    '',
    '-h, --help             output usage information',
    '-v, --version          output the version number',
    '',
  ].join('\n');

  process.stdout.write(`${message}\n`);
}

/**
 * Removes the files from the previous build.
 *
 * @function ()
 * @private
 * @param {}                -,
 * @returns {Object}        returns a promise,
 * @since 0.0.0
 */
function _clean() {
  const d1 = new Date();
  process.stdout.write('Starting \'\x1b[36mclean\x1b[89m\x1b[0m\'...\n');

  let pending = 1;
  const _next = function(resolve) {
    pending -= 1;
    if (!pending) {
      const d2 = new Date() - d1;
      process.stdout.write(`Finished '\x1b[36mclean\x1b[89m\x1b[0m' after \x1b[35m${d2} ms\x1b[89m\x1b[0m\n`);
      resolve();
    }
  };

  return new Promise((resolve) => {
    fs.rm(`${dist}/img`, { force: true, recursive: true }, (err1) => {
      if (err1) throw new Error(err1);
      _next(resolve);
    });
  });
}


/**
 * Copies img to production folder.
 *
 * @function (arg1)
 * @private
 * @param {function}        the function to call at the completion,
 * @returns {}              -,
 * @since 0.0.0
 */
function _cpimg(done) {
  const d1 = new Date();
  process.stdout.write('Starting \'\x1b[36mcopy:img\x1b[89m\x1b[0m\'...\n');

  fs.cp(`${root}/img`, `${dist}/img`, { recursive: true }, (err) => {
    let warning = '';
    if (err) {
      warning = ` - \x1b[31mwarning\x1b[89m\x1b[0m: '\x1b[36m${root}/img\x1b[89m\x1b[0m' folder does NOT exist!`;
    }

    const d2 = new Date() - d1;
    process.stdout.write(`Finished '\x1b[36mcopy:img\x1b[89m\x1b[0m' after \x1b[35m${d2} ms\x1b[89m\x1b[0m${warning}\n`);
    done();
  });
}


// -- Main ---------------------------------------------------------------------

/**
 * Executes the script.
 *
 * @function ()
 * @public
 * @param {}                -,
 * @returns {}              -,
 * @since 0.0.0
 */
async function run() {
  const PENDING = 1;

  if (parsed.help) {
    _help();
    return;
  }

  if (parsed.version) {
    process.stdout.write(`version: ${parsed.version}\n`);
    return;
  }

  const d1 = new Date();
  process.stdout.write('Starting \'\x1b[36mbuild:extra:prod\x1b[89m\x1b[0m\'...\n');

  let pending = PENDING;
  /**
   * Executes done until completion.
   */
  function done() {
    pending -= 1;
    if (!pending) {
      const d2 = new Date() - d1;
      process.stdout.write(`Finished '\x1b[36mbuild:extra:prod\x1b[89m\x1b[0m' after \x1b[35m${d2} ms\x1b[89m\x1b[0m\n`);
    }
  }

  await _clean();
  _cpimg(done);
}


// Start script.
run();


// -- oOo --
