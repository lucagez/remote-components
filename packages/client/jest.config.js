const path = require('path');

module.exports = {
  moduleDirectories: [
    "node_modules"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
  ],
  rootDir: path.resolve(__dirname, './tests'),
  testMatch: [
    "**/tests/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
};
