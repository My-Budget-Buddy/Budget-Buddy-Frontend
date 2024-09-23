/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  coverageDirectory: 'coverage',                       //Specify directory for coverage reports
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
};