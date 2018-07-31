### shorthand.js

Make client-to-server requests with payload using different methods:

* XHR (POST)
* Script Tag (JSONP)
* Stylesheet Tag
* Subdocument (PostMessage, iframe, cookies)
* WebSocket

In the future:

* Image (PNG)
* WebRTC

#### Install

```bash
npm install border-radius/shorthand --save
```

#### Import

```js
const shorthand = require('shorthand');
```

or

```js
import shorthand from 'shorthand'
```

#### Use

Client-side:

```js
shorthand.xhr.request(PROXY_URL, data).then(response_data => { ... });
shorthand.script.request(PROXY_URL, data).then(response_data => { ... });
shorthand.websocket.request(PROXY_URL, data).then(response_data => { ... });
shorthand.stylesheet.request(PROXY_URL, data).then(response_data => { ... });
shorthand.subdocument.request(PROXY_URL, data).then(response_data => { ... });
```

Server-side:

```js
const app = express();
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', shorthand.websocket.response(request_data => request(request_data)));

app.get('/xhr', shorthand.xhr.response(request_data => request(request_data)));
app.get('/xhr', shorthand.script.response(request_data => request(request_data)));
app.get('/xhr', shorthand.stylesheet.response(request_data => request(request_data)));
app.get('/xhr', shorthand.subdocument.response(request_data => request(request_data)));
```

#### Test

```bash
npm test
```
