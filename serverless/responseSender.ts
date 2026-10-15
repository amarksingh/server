class ResponseSender {
    /**
     * sendSuccess method.
     *
     * @static
     * @param {any} res
     * @param {any} result
     * @returns {any}
     */
    static sendSuccess(res: any, result: any) {
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

    /**
     * sendError method.
     *
     * @static
     * @param {any} res
     * @param {any} err
     * @returns {any}
     */
    static sendError(res: any, err: any) {
        const message = err && typeof err.message === 'string' ? err.message : String(err);
        if (typeof res.send === 'function') {
            return res.send(message, 500);
        }
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: message }));
    }
}

module.exports = ResponseSender;
