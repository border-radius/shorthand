function request (proxy, data) {
    return new Promise ((resolve, reject) => {
        const rand = Array.apply(null, {
            length: Math.random() * 8 + 4
        }).map(i => String.fromCharCode(Math.random()*25+97)).join('');
        const timeout = setTimeout(reject, 10000, new Error('Timeout'));
        window[rand] = function (input) {
            try {
                clearTimeout(timeout);
                resolve(JSON.parse(input));
            } catch (e) {
                reject(e);
            }
        };
        const script = document.createElement('script');
        const payload = encodeURIComponent(btoa(JSON.stringify(data)));
        script.src = [proxy, payload].join(['?', '='].join(rand));
        document.body.appendChild(script);
    });
}

function response (evaluate) {
    return function (req, res, next) {
        const param = Object.keys(req.query).pop();
        const payloadString = new Buffer(req.query[param], 'base64').toString();
        const payload = JSON.parse(payloadString);
        evaluate(payload).then(data => {
            const answer = JSON.stringify(data);
            res.set('Content-type', 'application/javascript');
            res.send(`${param}('${answer}')`);
        }).catch(e => res.send());
    }
}

exports.request = request;
exports.response = response;
