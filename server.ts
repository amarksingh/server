require('@ostro/support/helpers')
const ServerContract = require('@ostro/contracts/server/server')
const path = require('path');
const fs = require('fs')
const kSsl = Symbol('ssl')
const kServerType = Symbol('serverType')
const kHttpVersion = Symbol('httpversion')
const kStacks = Symbol('stack')
const Serverless = require('./adapter/serverless')
const HttpServer = require('./adapter/server');

var httpTypes = {
    http2: {
        module: 'http2',
        starter: 'createServer',
    },
    https2: {
        module: 'http2',
        starter: 'createSecureServer',
    },
    https: {
        module: 'https',
        starter: 'createServer',
    },
    http: {
        module: 'http',
        starter: 'createServer',
    }
}

function creatSslConfig(ssl, httpVersion) {
    let obj = Object.create(null)
    /**
     * switch method.
     *
     * @param {any} httpVersion
     * @returns {any}
     */
    switch (httpVersion) {
        case 'https':
            obj.key = ssl.key;
            obj.cert = ssl.cert;
            obj.ca = ssl.ca;
            break;
        case 'https2':
            obj.key = ssl.key;
            obj.cert = ssl.cert;
            obj.ca = ssl.ca;
            break;
        default:
            break;
    }
    return obj

}
class Server extends ServerContract {

    /**
     * constructor method.
     *
     * @param {any} {app
     * @param {any} serverless}
     * @returns {any}
     */
    constructor({app,serverless} = {}) {
        super()
        const config = resolveConfig(app);
        this.$port = config.port !== undefined ? config.port : 8080;
        this.$host = config.host || '127.0.0.1';
        this[kHttpVersion] = config.http_version;
        this[kSsl] = config.ssl;
        this[kServerType] = 'server';
        this[kStacks] = [];
        this.$serverlessConfig = serverless;
    }

    /**
     * register method.
     *
     * @param {any} path
     * @param {any} handle
     * @returns {any}
     */
    register(path, handle) {
        if (typeof path !== 'string') {
            handle = path;
            path = '/';
        }
        path = ('/' + path).replace(/\/\//g, "/").replace(/\/$/, "");
        if (Array.isArray(handle)) {
            for (let cb of handle) {
                this[kStacks].push({
                    route: path,
                    handle: cb
                });
            }
            return this
        }
        if (typeof handle.handle === 'function') {
            var server = handle;
            server.route = path;
            handle = function (req, res, next) {
                server.handle(req, res, next);
            };
        }

        this[kStacks].push({
            route: path,
            handle: handle
        });

        return this;
    }
    /**
     * createServerConfig method.
     *
     * @returns {any}
     */
    createServerConfig() {
        return Object.assign(creatSslConfig(this[kSsl], this[kHttpVersion]))
    }

    /**
     * address method.
     *
     * @param {any} options
     * @returns {any}
     */
    address(options = {}) {
        if (path.isAbsolute(String(options.port || ' '))) {
            return options.port
        } else {
            return {
                port: options.port !== undefined ? options.port : this.$port,
                host: options.host !== undefined ? options.host : this.$host,
                cert: options.cert,
                key: options.key
            }
        }
    }

    /**
     * request method.
     *
     * @param {any} HttpRequest
     * @returns {any}
     */
    request(HttpRequest) {
        if (typeof HttpRequest != 'function') {
            throw new Error('HttpRequest class must be function/class')
        }
        Object.defineProperty(this, '$request', { value: HttpRequest })
        return this;
    }

    /**
     * response method.
     *
     * @param {any} HttpResponse
     * @returns {any}
     */
    response(HttpResponse) {
        if (typeof HttpResponse != 'function') {
            throw new Error('HttpResponse class must function/class')
        }
        Object.defineProperty(this, '$response', { value: HttpResponse })
        return this;
    }

    /**
     * handle method.
     *
     * @returns {any}
     */
    handle() {
        if (this[kServerType] == 'serverless') {
            return (new Serverless(this.$serverlessConfig)).handle(this.$request, this.$response);
        } else if (this[kServerType] == 'server') {
            return (new HttpServer(this[kStacks])).handle(this.$request, this.$response);
        }
        throw new Error('Server type not supported');
    }

    /**
     * type method.
     *
     * @param {any} type
     * @returns {any}
     */
    type(type) {
        this[kServerType] = type;
        return this;
    }

    /**
     * start method.
     *
     * @param {any} options
     * @param {any} cb
     * @returns {any}
     */
    start(options, cb) {
        let args = Array.from(arguments)
        let rawOptions = args.find(arg => typeof arg == 'object' || typeof arg == 'string') || {}
        cb = args.find(arg => typeof arg == 'function')
        rawOptions = typeof rawOptions === 'string' ? { port: rawOptions } : rawOptions;
        let resolvedAddress = this.address(rawOptions)
        let httpConfig = httpTypes[this[kHttpVersion]]
        let http = require(httpConfig.module)

        if (typeof resolvedAddress === 'string') {
            this.$port = resolvedAddress;
        } else {
            this.$port = resolvedAddress.port;
            this.$host = resolvedAddress.host;
        }
        const listenTarget = path.isAbsolute(this.$port.toString()) ? this.$port : { port: this.$port, host: this.$host };
        return http[httpConfig.starter](this.createServerConfig(), this.handle())
            .listen(listenTarget, () => {
                if (typeof cb == 'function') {
                    cb({
                        port: this.$port,
                        host: this.$host,
                        server: ''
                    })
                } else {
                    console.log(`Application Running on ${path.isAbsolute(this.$port.toString()) ? 'pipe : ' + this.$port : ': ' + this.$host + ':' + this.$port}`)
                }
            });
    }

}

function resolveConfig(config = {}) {
    config.ssl = {
        'key': undefined,
        'cert': undefined,
        ...(config.ssl || {})
    }
    config.http_version = config.http_version || 'http'
    /**
     * if method.
     *
     * @param {any} config.http_version
     * @returns {any}
     */
    if (config.http_version == 'https' || config.http_version == "https2") {
        if (typeof config.ssl.key == 'string') {
            config.ssl.key = path.isAbsolute(config.ssl.key) ? fs.readFileSync(config.ssl.key) : fs.readFileSync(path.resolve(config.ssl.key));
        }
        if (typeof config.ssl.cert == 'string') {
            config.ssl.cert = path.isAbsolute(config.ssl.cert) ? fs.readFileSync(config.ssl.cert) : fs.readFileSync(path.resolve(config.ssl.cert));
        }
        if (typeof config.ssl.ca == 'string') {
            config.ssl.ca = path.isAbsolute(config.ssl.ca) ? fs.readFileSync(config.ssl.ca) : fs.readFileSync(path.resolve(config.ssl.ca));
        }
    }
    /**
     * if method.
     *
     * @param {any} config.port !
     * @returns {any}
     */
    if (config.port !== undefined) {
        config.port = parseInt(config.port)
    }
    return config
}

module.exports = Server;