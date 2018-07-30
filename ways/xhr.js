function request (proxy, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', proxy, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onerror = reject;
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.data);
                } catch (e) {
                    reject (e);
                }
            } else {
                reject(new Error(`HTTP ${xhr.status}`));
            }
        };

        xhr.send(JSON.stringify({ data: data }));
    });
}

function response (evaluate) {
    return (req, res, next) => {
        evaluate(req.body).then(data => {
            res.json({
                data: data
            });
        }).catch(e => {
            res.json({
                e: e.message
            });
        });
    };
}

exports.request = request;
exports.response = response;
