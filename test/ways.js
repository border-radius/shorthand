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

function frontend (type, url) {
    return (req, res) => {
        res.send([
            '<script>(',
            [
                ')("',
                '_get", "input").then(data => window.location = "',
                '_done?i=" + data)</script>'
            ].join(url)
        ].join(ways[type].request.toString()));
    }
}

function backend (type) {
    return ways[type].response(input => {
        assert.equal(input, 'input');
        return new Promise(resolve => resolve('output'));
    });
}

function check (done) {
    return (req, res) => {
        assert.equal(req.query.i, 'output');
        res.send();
        done();
    };
}

describe('Request', () => {
    it('should work through XHR', done => {
        app.get('/xhr', frontend('xhr', '/xhr'));
        app.post('/xhr_get', backend('xhr'));
        app.get('/xhr_done', check(done));
        driver.get('http://localhost:5949/xhr');
    });

    after(() => {
        server.close();
        return driver.quit();
    });
});
