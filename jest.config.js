module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["lcov", "text"],
  testEnvironment: "node",
  forceExit: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "routes/calculator.js",
    "server.js"
  ],
  // Optional: you can also set coverage thresholds for the remaining files
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
