# webview-query
Utility node.js library for [Chrome Webview](https://developer.chrome.com/apps/tags/webview) traversal and manipulation.

[![no dependencies](https://img.shields.io/badge/dependencies-none-green.svg)]()

## Install
`npm install webview-query --save`

## Example

For example, you have NW.js app with webview tag within.

`html:`

    <webview id="view1"></webview>

`js:`

    const { Webview } = require('webview-query');
    const webview = new Webview(view1);

    // inside async function:

    await webview.location('https://github.com');
    console.log(await webview.title());
    // -> "The world's leading software development platform · GitHub"

    console.log(await webview.text('.jumbotron h1'));
    // -> "Built for developers"

    webview.val('form.home-hero-signup input[id="user[login]"]', 'Hello GitHub!');

## Classes

<dl>
<dt><a href="#Webview">Webview</a></dt>
<dd></dd>
</dl>

## External

<dl>
<dt><a href="#external_webview">webview</a></dt>
<dd><p>Chrome webview element</p>
</dd>
</dl>

<a name="Webview"></a>

## Webview
**Kind**: global class

* [Webview](#Webview)
    * [new Webview(webview)](#new_Webview_new)
    * [.webview](#Webview+webview) : [<code>webview</code>](#external_webview)
    * [.runJs(code)](#Webview+runJs) ⇒ <code>Promise</code>
    * [.title()](#Webview+title) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.title(value)](#Webview+title) ⇒ <code>Promise</code>
    * [.location()](#Webview+location) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.location(value)](#Webview+location) ⇒ <code>Promise</code>
    * [.exists(selector)](#Webview+exists) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.length(selector)](#Webview+length) ⇒ <code>Promise.&lt;number&gt;</code>
    * [.val(selector)](#Webview+val) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.val(selector, value)](#Webview+val) ⇒ <code>Promise</code>
    * [.attr(selector, attribute)](#Webview+attr) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.attr(selector, attribute, value)](#Webview+attr) ⇒ <code>Promise</code>
    * [.text(selector)](#Webview+text) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.text(selector, value)](#Webview+text) ⇒ <code>Promise</code>
    * [.html(selector, [options])](#Webview+html) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.html(selector, value, [options])](#Webview+html) ⇒ <code>Promise</code>
    * [.click(selector)](#Webview+click) ⇒ <code>Promise</code>

<a name="new_Webview_new"></a>

### new Webview(webview)
Webview is a class for Chrome webview promise-based traversal and manipulation.


| Param | Type | Description |
| --- | --- | --- |
| webview | [<code>webview</code>](#external_webview) | Chrome webview element. |

<a name="Webview+webview"></a>

### webview.webview : [<code>webview</code>](#external_webview)
**Kind**: instance property of [<code>Webview</code>](#Webview)
<a name="Webview+runJs"></a>

### webview.runJs(code) ⇒ <code>Promise</code>
Run arbitrary javascript code inside webview context.

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise</code> - Promise object represents the result of the script.

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | Javascript code. |

<a name="Webview+title"></a>

### webview.title() ⇒ <code>Promise.&lt;string&gt;</code>
Get webview document title.

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise object represents the document title.
<a name="Webview+title"></a>

### webview.title(value) ⇒ <code>Promise</code>
Set webview document new title.

**Kind**: instance method of [<code>Webview</code>](#Webview)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | New document title. |

<a name="Webview+location"></a>

### webview.location() ⇒ <code>Promise.&lt;string&gt;</code>
Get webview current location.

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise object represents current location.
<a name="Webview+location"></a>

### webview.location(value) ⇒ <code>Promise</code>
Set webview new location.

**Kind**: instance method of [<code>Webview</code>](#Webview)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | URL or path to local file. |

<a name="Webview+exists"></a>

### webview.exists(selector) ⇒ <code>Promise.&lt;boolean&gt;</code>
Check the existence of an element(s).

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Promise object represents the element(s) existence.

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |

<a name="Webview+length"></a>

### webview.length(selector) ⇒ <code>Promise.&lt;number&gt;</code>
Return number of elements matched by selector.

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise.&lt;number&gt;</code> - Promise object represents the number of elements currently matched..

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |

<a name="Webview+val"></a>

### webview.val(selector) ⇒ <code>Promise.&lt;string&gt;</code>
Get the current value of the first element in the set of matched elements.

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise object represents the current value of the first element.

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |

<a name="Webview+val"></a>

### webview.val(selector, value) ⇒ <code>Promise</code>
Set the value of every matched element.

**Kind**: instance method of [<code>Webview</code>](#Webview)

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |
| value | <code>string</code> | Value to set. |

<a name="Webview+attr"></a>

### webview.attr(selector, attribute) ⇒ <code>Promise.&lt;string&gt;</code>
Get the value of an attribute for the first element in the set of matched elements.

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise object represents the attribute value of the first element.

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |
| attribute | <code>string</code> | The name of the attribute to get. |

<a name="Webview+attr"></a>

### webview.attr(selector, attribute, value) ⇒ <code>Promise</code>
Set an attribute for every matched element.

**Kind**: instance method of [<code>Webview</code>](#Webview)

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |
| attribute | <code>string</code> | The name of the attribute to set. |
| value | <code>string</code> | A value to set for the attribute.. |

<a name="Webview+text"></a>

### webview.text(selector) ⇒ <code>Promise.&lt;string&gt;</code>
Get the combined text contents of each element in the set of matched elements, including their descendants.

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise object represents a string containing the combined text of all matched elements.

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |

<a name="Webview+text"></a>

### webview.text(selector, value) ⇒ <code>Promise</code>
Set the text contents of the matched elements.

**Kind**: instance method of [<code>Webview</code>](#Webview)

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |
| value | <code>string</code> | The text to set as the content of each matched element. |

<a name="Webview+html"></a>

### webview.html(selector, [options]) ⇒ <code>Promise.&lt;string&gt;</code>
Get the HTML contents of the first element in the set of matched elements.

**Kind**: instance method of [<code>Webview</code>](#Webview)
**Returns**: <code>Promise.&lt;string&gt;</code> - Promise object represents a string containing inner or outer HTML for the first element.

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |
| [options] | <code>object</code> | Options. |
| [options.outer] | <code>boolean</code> | If true the result will be outer HTML, inner HTML otherwise. |

<a name="Webview+html"></a>

### webview.html(selector, value, [options]) ⇒ <code>Promise</code>
Set the HTML contents of every matched element.

**Kind**: instance method of [<code>Webview</code>](#Webview)

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |
| value | <code>string</code> | A string of HTML to set as the content of each matched element. |
| [options] | <code>object</code> | Options. |
| [options.outer] | <code>boolean</code> | If true the result will be outer HTML, inner HTML otherwise. |

<a name="Webview+click"></a>

### webview.click(selector) ⇒ <code>Promise</code>
Execute click action for the matched element(s).

**Kind**: instance method of [<code>Webview</code>](#Webview)

| Param | Type | Description |
| --- | --- | --- |
| selector | <code>string</code> | CSS selector. |

<a name="external_webview"></a>

## webview
Chrome webview element

**Kind**: global external
**See**: [https://developer.chrome.com/apps/tags/webview](https://developer.chrome.com/apps/tags/webview)
