const tsJestPath = "/Users/amarkumarsingh/.nvm/versions/node/v24.12.0/lib/node_modules/ts-jest";

module.exports = {
    "testEnvironment": "node",
    "moduleDirectories": [
        "node_modules",
        "../foundation/node_modules"
    ],
    "moduleNameMapper": {
        "^@ostro/support/(.*)$": "<rootDir>/../support/$1",
        "^@ostro/support$": "<rootDir>/../support",
        "^@ostro/contracts/(.*)$": "<rootDir>/../contracts/$1",
        "^@ostro/contracts$": "<rootDir>/../contracts",
        "^finalhandler$": "<rootDir>/../foundation/node_modules/finalhandler"
    },
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
        "**/*.ts",
        "serverless/wrappers/**/*.js",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!**/coverage/**",
        "!jest.config.js",
        "!test/**"
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
