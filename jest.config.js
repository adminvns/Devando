module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  testEnvironment: "node",
  forceExit: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "server.js"
  ],
  // Optional: you can also set coverage thresholds for the remaining files
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  }
};
