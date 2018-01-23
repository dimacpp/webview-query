# webview-query
Utility node.js library for [Chrome Webview](https://developer.chrome.com/apps/tags/webview) traversal and manipulation.

[![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg)]()

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
