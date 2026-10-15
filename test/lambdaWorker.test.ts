const LambdaWorker = require("../serverless/lambdaWorker");
const VmStrategy = require("../serverless/strategies/vmStrategy");
const ThreadStrategy = require("../serverless/strategies/threadStrategy");
const ForkStrategy = require("../serverless/strategies/forkStrategy");
const ProcessStrategy = require("../serverless/strategies/processStrategy");
const path = require("path");

describe("LambdaWorker (serverless/lambdaWorker.js)", () => {
    test("static create initializes with correct strategy for vm, thread, fork, process, and default", () => {
        const vmWorker = LambdaWorker.create("vm");
        expect(vmWorker.strategy).toBeInstanceOf(VmStrategy);

        const threadWorker = LambdaWorker.create("thread");
        expect(threadWorker.strategy).toBeInstanceOf(ThreadStrategy);

        const forkWorker = LambdaWorker.create("fork");
        expect(forkWorker.strategy).toBeInstanceOf(ForkStrategy);

        const processWorker = LambdaWorker.create("process");
        expect(processWorker.strategy).toBeInstanceOf(ProcessStrategy);

        const defaultWorker = LambdaWorker.create("other");
        expect(defaultWorker.strategy).toBeInstanceOf(ProcessStrategy);
    });

    test("run delegates to strategy with custom cwd option and default dirname", async () => {
        const mockStrategy = {
            run: jest.fn().mockResolvedValue("done")
        };
        const worker = new LambdaWorker(mockStrategy);

        // default cwd from path.dirname
        await worker.run("/app/handler.js", "index", { test: 1 });
        expect(mockStrategy.run).toHaveBeenCalledWith("/app/handler.js", "index", { test: 1 }, "/app");

        // custom cwd in options
        await worker.run("/app/handler.js", "index", { test: 2 }, { cwd: "/custom/cwd" });
        expect(mockStrategy.run).toHaveBeenCalledWith("/app/handler.js", "index", { test: 2 }, "/custom/cwd");
    });
});