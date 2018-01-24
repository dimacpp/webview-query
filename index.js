/* global chrome */

class Webview {
    constructor(webview) {
        if (!webview) throw new Error('Invalid webview param');
        this.webview = webview;
    }


    runJs(code) {
        return new Promise((resolve, reject) => {
            this.webview.executeScript({
                /* eslint-disable */
                code: `
                    ;(function() {
                        ${code}
                    })();
                `
                /* eslint-enable */
            }, (results) => {
                if (chrome.runtime.lastError) {
                    return reject(new Error(`Chrome last error: ${chrome.runtime.lastError.message || 'undefined'}`));
                }

                return resolve(results[0]);
            });
        }); // Promise
    }


    // API


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


    location(value) {
        if (typeof value === 'undefined') {
            return this.runJs(`
                return location.href;
            `);
        }

        return new Promise((resolve) => {
            this.webview.src = value;
            this.webview.addEventListener('loadstop', resolve, {
                once: true
            });
        });
    }


    exists(selector) {
        return this.runJs(`
            return (document.querySelectorAll('${selector}').length > 0);
        `);
    }


    length(selector) {
        const _s = Webview.escapeWrongQuotes(selector);
        return this.runJs(`
            return document.querySelectorAll('${_s}').length;
        `);
    }


    val(selector, value) {
        const _s = Webview.escapeWrongQuotes(selector);
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


    attr(selector, attribute, value) {
        const _s = Webview.escapeWrongQuotes(selector);
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


    text(selector, value) {
        const _s = Webview.escapeWrongQuotes(selector);
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


    html(selector, value, options) {
        const _s = Webview.escapeWrongQuotes(selector);
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


    click(selector) {
        const _s = Webview.escapeWrongQuotes(selector);
        return this.runJs(`
            document.querySelectorAll('${_s}')
                .forEach(el => el.click());
        `);
    }


    // utility methods


    static escapeWrongQuotes(selector) {
        return (typeof selector === 'string' ? selector.replace(/['`]/g, '"') : selector);
    }
}

module.exports = {
    Webview
};
