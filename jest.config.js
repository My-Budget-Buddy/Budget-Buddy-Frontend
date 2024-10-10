/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
  testTimeout: 60000,
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  coverageDirectory: 'coverage',                       //Specify directory for coverage reports
  coverageReporters: ["text", "lcov"],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  setupFiles: ['<rootDir>/__testSetup__/setupFile.ts'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/imageMock.ts',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.ts',
  },
  coveragePathIgnorePatterns: [
    'src/App.tsx',
    'src/i18n.ts',
    'src/main.tsx',
    'src/vite-env.d.ts',
    'src/api',
    'src/contexts',
    'src/pages/Root.tsx',
    'src/routing',
    'src/utils'
  ],
};