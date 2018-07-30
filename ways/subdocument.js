function request (proxy, data) {
    return new Promise ((resolve, reject) => {
        const iframe = document.createElement('iframe');
        const timeout = setTimeout(e => {
            stop();
            reject(e);
        }, 10000, new Error('Timeout'));

        function stop () {
            clearTimeout(timeout);
            document.body.removeChild(iframe)
            window.removeEventListener('message', listener);
        }

        function listener (e) {
            if (e.data.data) {
                stop();
                resolve(JSON.parse(e.data.data));
            } else if (e.data.ready) {
                iframe.contentWindow.postMessage(data, '*');
            }
        }

        window.addEventListener('message', listener);
        document.body.appendChild(iframe);
        iframe.src = proxy;
    });
}

function response (evaluate) {
    const PRE = '<script>window.top.postMessage({data:\'';
    const POST = '\'},\'*\');</script>';
    return (req, res) => {
        if (req.cookies.req) {
            const data = JSON.parse(new Buffer(req.cookies.req, 'base64').toString());
            res.clearCookie('res');
            evaluate(data)
            .then(answer => res.send([PRE, POST].join(JSON.stringify(answer))))
            .catch(e => res.send([PRE, POST].join(JSON.stringify(e.message))));
        } else {
            res.send(`<script>
            window.addEventListener("message", e => {
                if (e.data) {
                    document.cookie = ["req", btoa(JSON.stringify(e.data))].join("=");
                    window.location.reload();
                }
            });
            window.top.postMessage({ ready: true }, "*");
            </script>`);
        }
    };
}

exports.request = request;
exports.response = response;
