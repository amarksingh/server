module.exports = {
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', '../foundation/node_modules'],
    moduleNameMapper: {
        '^@ostro/support/(.*)$': '<rootDir>/../support/$1',
        '^@ostro/support$': '<rootDir>/../support',
        '^@ostro/contracts/(.*)$': '<rootDir>/../contracts/$1',
        '^@ostro/contracts$': '<rootDir>/../contracts',
        '^finalhandler$': '<rootDir>/../foundation/node_modules/finalhandler'
    },
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/coverage/**',
        '!jest.config.js',
        '!test/**'
    ],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
