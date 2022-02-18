/*! Copyright 2019 Ayogo Health Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

// COMMENT FROM ROLAND
// This is so that jest does not freak out when ts-jest is running and it sees a .js file import in typescript files
// See https://github.com/kulshekhar/ts-jest/issues/1057
// Jest does not seem to be able to handle ESM {"module": "ES2020"} and only works with "CommonJs"
// The problem is when we want to use ESM and so we are forced to use {"module": "ES2020"} and append .js in typescript imports
// What this resolver does is just remove the .js extension when jest runs so ts-jest can find the file

let defaultResolver;

function requireDefaultResolver() {
  if (!defaultResolver) {
    try {
      defaultResolver = require(`../node_modules/jest-resolve/build/defaultResolver`).default;
    } catch (error) {
      defaultResolver = require(`../node_modules/jest-resolve/build/default_resolver`).default;
    }
  }

  return defaultResolver;
}

module.exports = (request, options) => {
  const { basedir, defaultResolver, extensions } = options;

  if (!defaultResolver) {
    defaultResolver = requireDefaultResolver();
  }

  try {
    return defaultResolver(request, options);
  } catch (e) {
    return defaultResolver(request.replace(/\.js$/, ""), options);
  }
};
