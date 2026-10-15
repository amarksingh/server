const { fork } = require('child_process');
const path = require('path');

class ForkStrategy {
    async run(modulePath, handlerName, event, cwd) {
        return new Promise((resolve, reject) => {
            const forkWrapper = path.resolve(__dirname, '../wrappers/frokWrapper.js');
            const child = fork(forkWrapper, [modulePath, handlerName], { cwd, stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

            let settled = false;
            child.on('message', (msg) => {
                settled = true;
                if (msg.error) {
                    reject(new Error(msg.error));
                } else {
                    resolve(msg.result);
                }
            });

            child.on('error', (err) => {
                settled = true;
                reject(err);
            });
            child.on('exit', (code) => {
                if (!settled && code !== 0) {
                    reject(new Error(`Forked process exited with code ${code}`));
                }
            });

            child.send({ event });
        });
    }
}

module.exports = ForkStrategy;
