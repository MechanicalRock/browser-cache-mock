module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "/dist/",
    "/lib/",
    "/node_modules/"
  ]
};