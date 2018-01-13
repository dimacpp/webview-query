class Webview {
    constructor(webview) {
        this.webview = webview;
        this.vars = {};
        this.queue = [];
    }

    runJs(name, code) {
        const js = code || name;

        const promise = new Promise((resolve) => {
            this.webview.executeScript({
                /* eslint-disable */
                code: `
                    ;(function() {
                        ${js}
                    })();
                `
                /* eslint-enable */
            }, (results) => {
                if (name && code) {
                    this.vars[name] = results[0];
                }

                return resolve();
            });
        }); // Promise

        this.queue.push(promise);
        return this;
    }


    tap(callback) {
        Promise.all(this.queue)
            .then(() => {
                callback(this.vars);
            });

        return this;
    }


    // API


    isLoaded(name) {
        return this.runJs(name, `
            return ['interactive', 'complete'].includes(document.readyState);
        `);
    }


    getTitle() {
        return this.runJs('title', `
            return document.title;
        `);
    }


    setTitle(title) {
        return this.runJs(`
            return document.title = '${title}';
        `);
    }


    isExist(name, selector) {
        return this.runJs(name, `
            return (document.querySelectorAll('${selector}').length > 0);
        `);
    }


    getLength(name, selector) {
        return this.runJs(name, `
            return document.querySelectorAll('${selector}').length;
        `);
    }


    getValue(name, selector) {
        return this.runJs(name, `
            return (document.querySelector('${selector}') || { }).value;
        `);
    }


    setValue(selector, value) {
        return this.runJs(`
            document.querySelectorAll('${selector}')
                .forEach(el => {
                    el.value = '${value}';
                });
        `);
    }


    getText(name, selector) {
        return this.runJs(name, `

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

            return _getText(document.querySelectorAll('${selector}'));
        `);
    }
}

module.exports = webview => new Webview(webview);
