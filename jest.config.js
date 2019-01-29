module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "/dist/",
    "/lib/",
    "/node_modules/"
  ],
  coverageThreshold: {
    global: {
      branches: 94,
      statements: 98,
      lines: 98,
      functions: 95
    }
  }
};