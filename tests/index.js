Object.keys(require.cache).forEach(key => { delete require.cache[key] })  

const util = require('util');
const fs = require('fs');
const gui = require('nw.gui');
const { assert } = require('chai');
const { Webview } = require('../index.js');

gui.Window.get().showDevTools();


document.addEventListener('DOMContentLoaded', async () => {

    try {

        await run(_title);
        await run(_location);
        await run(_exists);
        await run(_length);
        await run(_val);
        await run(_text);
        await run(_htmlInner);
        await run(_htmlOuter);
        await run(_click);
        await run(_attr);
        
        await run(_wrongQuotes);

        console.log('PASSED');

    }
    catch(err) {
        console.log(`%cmessage: "${err.message}"`, 'color: red;');
    }

});


function run(testFunc) {
    return new Promise(async (resolve, reject) => {

        try {
            const webview = new Webview(view1);
            await webview.location('./htmls/view1.html');

            await testFunc(webview);

            console.log(`${testFunc.name} is passed`);
            return resolve();
        }
        catch(err) {
            console.log(`%c${testFunc.name} is FAILED`, 'color: red;');
            return reject(err);
        }
    });    
}


// Tests

async function _title(webview) {
    // get
    assert(await webview.title() === 'my title', `(1) is failed`);
    // set, get
    await webview.title('new title');
    assert(await webview.title() === 'new title', `(2) is failed`);
}


async function _location(webview) {
    assert(/chrome-extension:\/\/[a-z]+\/htmls\/view1.html/.test(await webview.location()), `(1) is failed`)
}


async function _exists(webview) {
    assert(await webview.exists('html') === true, `(1) is failed`);
    assert(await webview.exists('#mydiv1') === true, `(2) is failed`);
    assert(await webview.exists('#mydiv2') === true, `(3) is failed`);
    assert(await webview.exists('#mydiv3') === false, `(4) is failed`);
    assert(await webview.exists('.mydiv') === true, `(5) is failed`);
}


async function _length(webview) {
    assert(await webview.length('html') === 1, `(1) is failed`);
    assert(await webview.length('#mydiv1') === 1, `(2) is failed`);
    assert(await webview.length('#mydiv2') === 1, `(3) is failed`);
    assert(await webview.length('#notexist') === 0, `(4) is failed`);
    assert(await webview.length('.mydiv') === 2, `(5) is failed`);
    assert(await webview.length('div') === 3, `(6) is failed`);
    assert(await webview.length('input') === 2, `(7) is failed`);
}


async function _val(webview) {
    // get
    assert(await webview.val('#myinput1') === '41', `(1) is failed`);
    assert(await webview.val('#myinput2') === '42', `(2) is failed`);
    assert(await webview.val('.myinput') === '41', `(3) is failed`);
    assert(await webview.val('#notexist') === '', `(4) is failed`);
    assert(await webview.val('#mydiv1') === '', `(5) is failed`);
    // set, get
    await webview.val('#myinput1', 98);
    assert(await webview.val('#myinput1') === '98', `(6) is failed`);
    await webview.val('#myinput2', 'some text');
    assert(await webview.val('#myinput2') === 'some text', `(7) is failed`);
}


async function _text(webview) {
    // get
    assert(await webview.text('#mydiv1') === 'Hello', `(1) is failed`);
    assert(await webview.text('.mydiv') === 'HelloWebview', `(2) is failed`);
    assert((await webview.text('div')).replace(/(?:\r\n|\r|\n)/g, '*') === 'HelloWebview*        Tester*        *    ', `(3) is failed`);
    assert(await webview.text('#notexist') === '', `(4) is failed`);
    assert(await webview.text('#myinput1') === '', `(5) is failed`);

    // get, set
    await webview.text('#mydiv1', 'Aloha')
    assert(await webview.text('#mydiv1') === 'Aloha', `(6) is failed`);
    await webview.text('.mydiv', 'Happy')
    assert(await webview.text('#mydiv1') === 'Happy', `(7) is failed`);
    assert(await webview.text('#mydiv2') === 'Happy', `(8) is failed`);
    assert(await webview.text('.mydiv') === 'HappyHappy', `(9) is failed`);
}


async function _htmlInner(webview) {
    // get
    assert(/<head[^>]*>[\s\S]*<\/body>/.test(await webview.html('html')), '(1) is failed');
    assert(await webview.html('#mydiv1') === 'Hello<span></span>', '(2) is failed');
    assert(await webview.html('#mydiv2') === 'Webview', '(3) is failed');
    assert(await webview.html('.mydiv') === 'Hello<span></span>', '(4) is failed');
   
    // get, set
    await webview.html('#mydiv1', 'Regular<b>Bold</b>');
    assert(await webview.html('#mydiv1') === 'Regular<b>Bold</b>', '(5) is failed');
    await webview.html('.mydiv', '<span>Whoa</span>');
    assert(await webview.html('#mydiv1') === '<span>Whoa</span>', '(6) is failed');
    assert(await webview.html('#mydiv2') === '<span>Whoa</span>', '(7) is failed');
}

async function _htmlOuter(webview) {
    // get
    assert(/<html[^>]*>[\s\S]*<\/html>/.test(await webview.html('html', { outer: true })), '(1) is failed');
    assert(await webview.html('#mydiv1', { outer: true }) === '<div id="mydiv1" class="mydiv">Hello<span></span></div>', '(2) is failed');
    assert(await webview.html('#mydiv2', { outer: true }) === '<div id="mydiv2" class="mydiv">Webview</div>', '(3) is failed');
    assert(await webview.html('.mydiv', { outer: true }) === '<div id="mydiv1" class="mydiv">Hello<span></span></div>', '(4) is failed');

    // get, set
    await webview.html('#mydiv1', '<div id="mydiv1" class="mydiv">Foo<span>Bar</span></div>', { outer: true });
    assert(await webview.html('#mydiv1', { outer: true }) === '<div id="mydiv1" class="mydiv">Foo<span>Bar</span></div>', '(5) is failed');
    await webview.html('.mydiv', '<span>Whoa</span>', { outer: true });
    assert(await webview.html('#mydiv1', { outer: true }) === null, '(6) is failed');
    assert(await webview.html('#mydiv2', { outer: true }) === null, '(7) is failed');
}

async function _click(webview) {
    assert(await webview.val('#myinput1') !== 'clicked', `(1) is failed`);
    await webview.click('button');
    assert(await webview.val('#myinput1') === 'clicked', `(2) is failed`);
}

async function _attr(webview) {
    // get
    assert(await webview.attr('#mydiv1', 'notexist') === '', `(1) is failed`);
    assert(await webview.attr('#mydiv1', 'class') === 'mydiv', `(2) is failed`);

    // get, set
    await webview.attr('#mydiv1', 'my-custom-attr', 'my custom value');
    assert(await webview.attr('#mydiv1', 'my-custom-attr') === 'my custom value', `(3) is failed`);
    await webview.attr('.mydiv', 'data-custom', 'hello world');
    assert(await webview.attr('#mydiv1', 'data-custom') === 'hello world', `(4) is failed`);
    assert(await webview.attr('#mydiv2', 'data-custom') === 'hello world', `(5) is failed`);
    assert(await webview.attr('.mydiv', 'data-custom') === 'hello world', `(6) is failed`);
}

async function _wrongQuotes(webview) {
    // get
    assert(await webview.text(`div[class='mydiv']`) === 'HelloWebview', `(1) is failed`);
    assert(await webview.text('div[class=`mydiv`]') === 'HelloWebview', `(2) is failed`);
}