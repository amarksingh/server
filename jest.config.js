const tsJestPath = "/Users/amarkumarsingh/.nvm/versions/node/v24.12.0/lib/node_modules/ts-jest";

module.exports = {
    "testEnvironment": "node",
    "moduleDirectories": [
        "node_modules",
        "../foundation/node_modules"
    ],
    "moduleNameMapper": {
        "^@ostro/support/(.*)$": "<rootDir>/../support/src/$1",
        "^@ostro/support$": "<rootDir>/../support/src",
        "^@ostro/contracts/(.*)$": "<rootDir>/../contracts/src/$1",
        "^@ostro/contracts$": "<rootDir>/../contracts/src",
        "^@ostro/server/(.*)$": "<rootDir>/src/$1",
        "^@ostro/server$": "<rootDir>/src/server",
        "^finalhandler$": "<rootDir>/../foundation/node_modules/finalhandler"
    },
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
        "src/**/*.ts",
        "src/serverless/wrappers/**/*.js",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!**/coverage/**",
        "!**/build/**",
        "!jest.config.js",
        "!test/**"
    ],
    "testPathIgnorePatterns": [
        "/node_modules/",
        "/build/"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 100,
            "functions": 100,
            "lines": 100,
            "statements": 100
        }
    },
    "testMatch": [
        "**/test/**/*.test.ts",
        "**/test/**/*.test.js"
    ],
    "transform": {
        "^.+\\.ts$": [
            tsJestPath,
            {
                "tsconfig": "<rootDir>/tsconfig.json"
            }
        ]
    }
};
