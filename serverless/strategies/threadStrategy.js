const { Worker } = require('worker_threads');
const path = require('path');

class ThreadStrategy {
    async run(modulePath, handlerName, event) {
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
