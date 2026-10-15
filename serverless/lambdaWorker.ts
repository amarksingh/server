const path = require('path');
const VmStrategy = require('./strategies/vmStrategy');
const ThreadStrategy = require('./strategies/threadStrategy');
const ProcessStrategy = require('./strategies/processStrategy');
const ForkStrategy = require('./strategies/forkStrategy');

class LambdaWorker {
    /**
     * constructor method.
     *
     * @param {any} strategy
     * @returns {any}
     */
    constructor(strategy) {
        this.strategy = strategy;
    }

    /**
     * run method.
     *
     * @param {any} modulePath
     * @param {any} handlerName
     * @param {any} event
     * @param {any} options
     * @returns {any}
     */
    run(modulePath, handlerName, event, options = {}) {
        const cwd = options.cwd || path.dirname(modulePath);
        return this.strategy.run(modulePath, handlerName, event, cwd);
    }

    /**
     * create method.
     *
     * @static
     * @param {any} strategyName
     * @returns {any}
     */
    static create(strategyName) {
        switch (strategyName) {
            case 'vm': return new LambdaWorker(new VmStrategy());
            case 'thread': return new LambdaWorker(new ThreadStrategy());
            case 'fork': return new LambdaWorker(new ForkStrategy());
            case 'process':
            default: return new LambdaWorker(new ProcessStrategy());
        }
    }
}

module.exports = LambdaWorker;
