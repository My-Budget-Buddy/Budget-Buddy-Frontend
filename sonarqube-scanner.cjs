const scanner = require('sonarqube-scanner').default;

scanner(
    {
      serverUrl: '${SONAR_SERVER_URL}',
      token: '${SONAR_TOKEN}',
      options: {
        'sonar.projectName': '${SONAR_PROJECT_NAME}',
        'sonar.projectDescription': 'SonarQube project for ${SONAR_PROJECT_NAME}',
        'sonar.sources': 'src',
        'sonar.tests': 'test',
      },
    },
    error => {
      if (error) {
        console.error(error);
      }
      process.exit();
    },
  );