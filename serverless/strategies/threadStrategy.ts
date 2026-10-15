const { Worker } = require('worker_threads');
const path = require('path');

class ThreadStrategy {
    /**
     * run method.
     *
     * @async
     * @param {any} modulePath
     * @param {any} handlerName
     * @param {any} event
     * @returns {any}
     */
    async run(modulePath: any, handlerName: any, event: string) {
        return new Promise((resolve, reject) => {
            const workerPath = path.resolve(__dirname, '../wrappers/threadWrapper.js');
            const worker = new Worker(workerPath, {
                workerData: { modulePath, handlerName, event }
            });
            worker.on('message', (msg) => {
                if (msg && msg.error) {
                    reject(new Error(msg.error));
                } else {
                    resolve(msg);
                }
            });
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }
}

module.exports = ThreadStrategy;
