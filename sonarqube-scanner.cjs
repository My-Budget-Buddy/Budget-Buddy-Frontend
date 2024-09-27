const scanner = require('sonarqube-scanner').default;
const env = require('node:process').env;

scanner(
    {
      serverUrl: env.SONAR_SERVER_URL,
      token: env.SONAR_TOKEN,
      options: {
        'sonar.organization': 'my-budget-buddy',

        'sonar.projectName': env.SONAR_PROJECT_NAME,
        'sonar.projectKey':  env.SONAR_PROJECT_KEY,
        'sonar.projectDescription': 'SonarQube project for ' + env.SONAR_PROJECT_NAME,

        'sonar.branch.name': env.BRANCH_NAME,

        'sonar.sources': 'src',
        'sonar.exclusions': 'src/App.tsx,src/i18n.ts,src/main.tsx,src/vite-env.d.ts,src/api/**,src/api/config.ts,src/components/**,src/contexts/**,src/layouts/**,src/pages/Root.tsx,src/pages/Budgets/components/modals/**,src/pages/Budgets/components/requests/**,src/pages/Budgets/components/subComponents/**,src/pages/Budgets/components/util/**,src/pages/Tax/TaxesAPI.ts,src/routing/**,src/util/**',
        'sonar.tests': '__tests__',
        // 'sonar.testExecutionReportPaths': 'test-report.xml',
        'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info'
      },
    },
    error => {
      if (error) {
        console.error(error);
      }
      process.exit();
    },
  );