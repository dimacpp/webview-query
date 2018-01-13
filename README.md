# webview-query
Utility node.js library for [Chrome Webview](https://developer.chrome.com/apps/tags/webview) traversal and manipulation.
[![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg)]()

## Install
`npm install webview-query --save`
    
## Example

For example, you have NW.js app with webview tag within.
    
`html:`

    <webview id="view1" src="https://github.com"></webview>
    
`js:`

    const wq = require(`webview-query`);

    view1.addEventListener(`loadstop`, () => {

        wq(view1)
            .getTitle()
            .getText('mainH1', '.jumbotron h1')
            .isExist('isSignUpNeeded', 'form.home-hero-signup input[id="user[login]"]')
            .setValue('form.home-hero-signup input[id="user[login]"]', 'Hello GitHub!')
            .tap(vars => {
                console.log(vars);
                /*
                    {
                        "title": "The world's leading software development platform · GitHub",
                        "mainH1": "Built for developers",
                        "isSignUpNeeded": true
                    }                
                */
            });
    });
