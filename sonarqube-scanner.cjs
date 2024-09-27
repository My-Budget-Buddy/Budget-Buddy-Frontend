const scanner = require('sonarqube-scanner').default;
const env = require('node:process').env;

scanner(
    {
      serverUrl: 'https://sonarcloud.io/', // env.SONAR_SERVER_URL,
      token: '7631d4ee8f875e5df09ae9e98110e9022590c055', // env.SONAR_TOKEN,
      options: {
        'sonar.organization': 'my-budget-buddy',

        'sonar.projectName': 'Budget-Buddy-Frontend', // env.SONAR_PROJECT_NAME,
        'sonar.projectKey': 'My-Budget-Buddy_Budget-Buddy-Frontend', // env.SONAR_PROJECT_KEY,
        'sonar.projectDescription': 'SonarQube project for ' + 'Budget-Buddy-Frontend',// env.SONAR_PROJECT_NAME,

        'sonar.branch.name': 'testing-cohort-dev', // env.BRANCH_NAME,

        'sonar.sources': 'src',
        'sonar.tests': 'src/__tests__',
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