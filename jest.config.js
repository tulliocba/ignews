module.exports = {
    testPathIgnorePatterns: ["/.next/", "/node_modules/"],
    setupFilesAfterEnv: [
        "<rootDir>/src/tests/setupTests.ts"
    ],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },

    moduleNameMapper: {
        "\\.(scss|css|sass)" : "identity-obj-proxy"
    },
    testEnvironment: "jsdom"
}