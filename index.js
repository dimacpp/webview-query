/* global chrome */

/**
 * Chrome webview element
 * @external webview
 * @see {@link https://developer.chrome.com/apps/tags/webview}
 */

class Webview {
  /**
   * Webview is a class for Chrome webview promise-based traversal and manipulation.
   * @constructor
   * @param {external:webview} webview Chrome webview element.
   */
  constructor(webview) {
    if (!webview) throw new Error('Invalid webview param');
    /** @type {external:webview} */
    this.webview = webview;
  }


  /**
   * Run arbitrary javascript code inside webview context.
   * @param {string} code Javascript code.
   * @returns {Promise} Promise object represents the result of the script.
   */
  runJs(code) {
    return new Promise((resolve, reject) => {
      this.webview.executeScript({
        code: `
          ;(function() {
            ${code}
          })();
        `,
      }, (results) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(`Chrome last error: ${chrome.runtime.lastError.message || 'undefined'}`));
        }

        return resolve(results[0]);
      });
    });
  }


  // API


  /**
   * Get webview document title.
   * @returns {Promise<string>} Promise object represents the document title.
   */
  /**
   * Set webview document new title.
   * @param {string} value New document title.
   * @returns {Promise}
   */
  title(value) {
    if (typeof value === 'undefined') {
      return this.runJs(`
        return document.title;
      `);
    }

    return this.runJs(`
      document.title = '${value}';
    `);
  }


  /**
   * Get webview current location.
   * @returns {Promise<string>} Promise object represents current location.
   */
  /**
   * Set webview new location.
   * @param {string} value URL or path to local file.
   * @returns {Promise}
   */
  location(value) {
    if (typeof value === 'undefined') {
      return this.runJs(`
        return location.href;
      `);
    }

    this.webview.src = value;
    return Promise.race([this.waitForLoadstart(), Webview.waitForTimeout()]);
  }


  /**
   * Check the existence of an element(s).
   * @param {string} selector CSS selector.
   * @returns {Promise<boolean>} Promise object represents the element(s) existence.
   */
  exists(selector) {
    const _s = Webview.replaceWrongQuotes(selector);
    return this.runJs(`
      return (document.querySelectorAll('${_s}').length > 0);
    `);
  }


  /**
   * Return number of elements matched by selector.
   * @param {string} selector CSS selector.
   * @returns {Promise<number>} Promise object represents the number of elements currently matched..
   */
  length(selector) {
    const _s = Webview.replaceWrongQuotes(selector);
    return this.runJs(`
      return document.querySelectorAll('${_s}').length;
    `);
  }


  /**
   * Get the current value of the first element in the set of matched elements.
   * @param {string} selector CSS selector.
   * @returns {Promise<string>} Promise object represents the current value of the first element.
   */
  /**
   * Set the value of every matched element.
   * @param {string} selector CSS selector.
   * @param {string} value Value to set.
   * @returns {Promise}
   */
  val(selector, value) {
    const _s = Webview.replaceWrongQuotes(selector);
    if (typeof value === 'undefined') {
      return this.runJs(`
        const el = document.querySelector('${_s}');
        const val = (el !== null ? el.value : '');
        return (typeof val === 'string' ? val : '');
      `);
    }

    return this.runJs(`
      document.querySelectorAll('${_s}')
        .forEach(el => el.value = '${value}');
    `);
  }


  /**
   * Get the value of an attribute for the first element in the set of matched elements.
   * @param {string} selector CSS selector.
   * @param {string} attribute The name of the attribute to get.
   * @returns {Promise<string>} Promise object represents the attribute value of the first element.
   */
  /**
   * Set an attribute for every matched element.
   * @param {string} selector CSS selector.
   * @param {string} attribute The name of the attribute to set.
   * @param {string} value A value to set for the attribute..
   * @returns {Promise}
   */
  attr(selector, attribute, value) {
    const _s = Webview.replaceWrongQuotes(selector);
    if (typeof value === 'undefined') {
      return this.runJs(`
        const el = document.querySelector('${_s}');
        const val = (el !== null ? el.getAttribute('${attribute}'): '');
        return (typeof val === 'string' ? val: '');
      `);
    }

    return this.runJs(`
      document.querySelectorAll('${_s}')
        .forEach(el => el.setAttribute('${attribute}', '${value}'));
    `);
  }


  /**
   * Get the combined text contents of each element in the set of matched elements, including their descendants.
   * @param {string} selector CSS selector.
   * @returns {Promise<string>} Promise object represents a string containing the combined text of all matched elements.
   */
  /**
   * Set the text contents of the matched elements.
   * @param {string} selector CSS selector.
   * @param {string} value The text to set as the content of each matched element.
   * @returns {Promise}
   */
  text(selector, value) {
    const _s = Webview.replaceWrongQuotes(selector);
    if (typeof value === 'undefined') {
      return this.runJs(`
        let _getText = el => {
            if (!el) return '';

            if ([Node.ELEMENT_NODE, Node.DOCUMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(el.nodeType)) {
              if (typeof el.textContent === 'string') {
                return el.textContent;
              }

              let result = [];

              for (el = el.firstChild; el; el = el.nextSibling) {
                result.push(_getText(el));
              }

              return result.join('');
            }

            if ([Node.TEXT_NODE, Node.CDATA_SECTION_NODE].includes(el.nodeType)) {
              return el.nodeValue;
            }

            if (!el.nodeType) {
              let node;
              let i = 0;
              let result =[];

              while (node = el[i++]) {
                result.push(_getText(node));
              }

              return result.join('');
            }
        };

        return _getText(document.querySelectorAll('${_s}'));
      `);
    }

    return this.runJs(`
      document.querySelectorAll('${_s}')
        .forEach(el => el.textContent = '${value}');
    `);
  }


  /**
   * Get the HTML contents of the first element in the set of matched elements.
   * @param {string} selector CSS selector.
   * @param {object} [options] Options.
   * @param {boolean} [options.outer] If true the result will be outer HTML, inner HTML otherwise.
   * @returns {Promise<string>} Promise object represents a string containing inner or outer HTML for the first element.
   */
  /**
   * Set the HTML contents of every matched element.
   * @param {string} selector CSS selector.
   * @param {string} value A string of HTML to set as the content of each matched element.
   * @param {object} [options] Options.
   * @param {boolean} [options.outer] If true the result will be outer HTML, inner HTML otherwise.
   * @returns {Promise}
   */
  html(selector, value, options) {
    const _s = Webview.replaceWrongQuotes(selector);
    const opts = (typeof options === 'undefined' ? value : options);
    const _m = ((typeof opts === 'object' && opts.outer === true) ? 'outerHTML' : 'innerHTML');

    if (typeof value !== 'string') {
      return this.runJs(`
        return (document.querySelector('${_s}') || { }).${_m};
      `);
    }

    return this.runJs(`
      document.querySelectorAll('${_s}')
        .forEach(el => el.${_m} = '${value}');
    `);
  }


  /**
   * Execute click action for the matched element(s).
   * @param {string} selector CSS selector.
   * @returns {Promise}
   */
  click(selector) {
    const _s = Webview.replaceWrongQuotes(selector);
    return this.runJs(`
      document.querySelectorAll('${_s}')
        .forEach(el => el.click());
    `);
  }


  // utility methods


  /**
   * Help to wait for loadstop-event of the webview.
   * @param {string} selector CSS selector.
   * @returns {Promise}
   * @private
   */
  waitForLoadstart() {
    return new Promise((resolve) => {
      this.webview.addEventListener('loadstop', resolve, {
        once: true,
      });
    });
  }


  /**
   * Replaces any single and backtick quote to double quote.
   * @param {string} selector CSS selector.
   * @returns {string}
   * @static
   * @private
   */
  static replaceWrongQuotes(selector) {
    return (typeof selector === 'string' ? selector.replace(/['`]/g, '"') : selector);
  }


  /**
   * Timeout to prevent freezing.
   * @returns {Promise}
   * @static
   * @private
   */
  static waitForTimeout() {
    return new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
  }
}

module.exports = {
  Webview,
};
