/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  coverageDirectory: 'coverage',                       //Specify directory for coverage reports
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  setupFiles: ['<rootDir>/src/__testSetup__/setupFile.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/imageMock.ts',
    '\\.(css|less)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
};