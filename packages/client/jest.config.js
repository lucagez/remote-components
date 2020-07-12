const path = require('path');

module.exports = {
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  rootDir: path.resolve(__dirname, './tests'),
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],
  preset: 'jest-puppeteer',
  testEnvironment: 'jsdom',
};
