class ResponseSender {
    static sendSuccess(res, result) {
        if (result.cookies) {
            result.headers = result.headers || {};
            result.headers['Set-Cookie'] = result.cookies;
        }
        res.writeHead(result.statusCode || 200, result.headers || {});
        if (result.isBase64Encoded) {
            const buffer = Buffer.from(result.body || '', 'base64');
            res.end(buffer);
        } else {
            res.end(result.body || '');
        }
    }

    static sendError(res, err) {
        const message = err && typeof err.message === 'string' ? err.message : String(err);
        if (typeof res.send === 'function') {
            return res.send(message, 500);
        }
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
    }
}

module.exports = ResponseSender;
