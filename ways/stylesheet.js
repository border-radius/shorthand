function request (proxy, data) {
    return new Promise ((resolve, reject) => {
        const rand = Array.apply(null, {
            length: Math.random() * 8 + 4
        }).map(i => String.fromCharCode(Math.random()*25+97)).join('');
        const payload = encodeURIComponent(btoa(JSON.stringify(data)));
        const href = [proxy, [rand, payload].join('=')].join('?');
        console.log(href);
        const timeout = setTimeout(reject, 10000, new Error('Timeout'));
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = href;
        style.onerror = e => {
            clearInterval(timeout);
            document.head.removeChild(style);
            reject(e);
        };
        style.onload = () => {
            try {
                clearInterval(timeout);
                const sheets = Array.prototype.slice.call(document.styleSheets);
                const sheet = sheets.filter(sheet => sheet.href === href).pop();
                const cssContent = sheet.cssRules[0].style.content;
                document.head.removeChild(style);
                resolve(JSON.parse(atob(cssContent.slice(1, -1))));
            } catch (e) {
                reject(e);
            }
        };
        document.head.appendChild(style);
    });
}

function response (evaluate) {
    return (req, res) => {
        const param = Object.keys(req.query).pop();
        const payloadString = new Buffer(req.query[param], 'base64').toString();
        const payload = JSON.parse(payloadString);
        evaluate(payload).then(data => {
            const answer = new Buffer(JSON.stringify(data)).toString('base64');
            res.set('Content-type', 'text/css');
            res.send(`.${param}:before{content:'${answer}';}`);
        }).catch(e => res.send());
    };
}

exports.request = request;
exports.response = response;
