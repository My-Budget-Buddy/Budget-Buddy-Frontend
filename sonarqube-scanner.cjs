const scanner = require('sonarqube-scanner').default;
const env = require('node:process').env;

scanner(
    {
      serverUrl: env.SONAR_SERVER_URL,
      token: env.SONAR_TOKEN,
      options: {
        'sonar.projectName': env.SONAR_PROJECT_NAME,
        'sonar.projectDescription': 'SonarQube project for ${SONAR_PROJECT_NAME}',
        'sonar.sources': 'src',
        // 'sonar.tests': 'test',
      },
    },
    error => {
      if (error) {
        console.error(error);
      }
      process.exit();
    },
  );