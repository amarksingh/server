const LambdaSimulator = require('../serverless/lambdaSimulator');
class ServerLess {
    /**
     * constructor method.
     *
     * @param {any} serverlessConfig
     * @returns {any}
     */
    constructor(serverlessConfig: any) {
        Object.defineProperties(this, {
            $lambda: {
                value: new LambdaSimulator(serverlessConfig)
            }
        })

    }

    /**
     * handle method.
     *
     * @param {any} request
     * @param {any} response
     * @returns {any}
     */
    handle($request: any, $response: any) {
        return (req, res) => {
            req = new $request(req);
            res = new $response(res);
            return this.$lambda.handleHttpRequest(req, res)
        }
    }
}
module.exports = ServerLess;