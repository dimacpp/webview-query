Object.keys(require.cache).forEach(key => { delete require.cache[key] })  

const gui = require('nw.gui');
const wq = require(`../index.js`);

gui.Window.get().showDevTools();

document.addEventListener('DOMContentLoaded', async () => {

    try {

        await testTitle();

        console.log('TESTS: PASSED');

    }
    catch(err) {
        console.log('TESTS: something is failed');
        console.log(err);
    }

});



function testTitle() {

    return new Promise((resolve, reject) => {

        const testName = arguments.callee.name;

        view1.addEventListener(`loadstop`, () => {

            wq(view1)
                .getTitle()
                .tap(vars => {

                    if (vars.title !== 'my title') {
                        return reject(new Error(`${testName} (1) is failed`));
                    }

                })
                .setTitle('new title')
                .getTitle()
                .tap(vars => {

                    if (vars.title !== 'new title') {
                        return reject(new Error(`${testName} (2) is failed`));
                    }

                    console.log(`${testName} is passed`);
                    return resolve();
                });

        });

        view1.src = './htmls/view1.html';

    });

}



