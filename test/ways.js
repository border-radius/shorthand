const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const webdriver = require('selenium-webdriver');
const ways = require('../ways');

const app = express();
const server = app.listen(5949);

app.use(bodyParser.json());

const WEBDRIVER_BROWSER = 'chrome';
const WEBDRIVER_WINDOW_WIDTH = 320;
const WEBDRIVER_WINDOW_HEIGHT = 480;

const driver = new webdriver.Builder().forBrowser(WEBDRIVER_BROWSER).build();
driver.manage().window().setSize(WEBDRIVER_WINDOW_WIDTH, WEBDRIVER_WINDOW_HEIGHT);

describe('Request', () => {
    it('should work through XHR', done => {
        app.get('/xhr', (req, res) => {
            res.send([
                '<script>(',
                ')("/xhr", "input").then(data => window.location = "/xhr_done?i=" + data)</script>'
            ].join(ways.xhr.request.toString()));
        });

        app.post('/xhr', ways.xhr.response(input => {
            assert.equal(input.data, 'input');
            return new Promise(resolve => resolve('output'));
        }));

        app.get('/xhr_done', (req, res) => {
            assert.equal(req.query.i, 'output');
            res.send();
            done();
        });

        driver.get('http://localhost:5949/xhr');
    });

    after(() => {
        server.close();
        return driver.quit();
    });
});
