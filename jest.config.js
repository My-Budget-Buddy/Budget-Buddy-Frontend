/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "jsdom",
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
    'src/api/services',
    'src/api/config.ts',
    'src/contexts',
    'src/layouts',
    'src/pages/Root.tsx',
    'src/pages/Budgets/components/modals',
    'src/pages/Budgets/components/requests',
    'src/pages/Budgets/components/subComponents',
    'src/pages/Budgets/components/util',
    'src/pages/Tax/TaxesAPI.ts',
    'src/routing',
    'src/util'
  ],
};