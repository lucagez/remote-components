const path = require('path');

module.exports = {
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  rootDir: path.resolve(__dirname),
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./tests/setup-tests.js'],
  collectCoverageFrom: ['./src/**/*.{js,jsx,ts,tsx}', '!<rootDir>/node_modules/'],
};
