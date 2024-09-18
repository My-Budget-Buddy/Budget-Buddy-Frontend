const scanner = require('sonarqube-scanner').default;

scanner(
    {
        serverUrl: '${{ SONAR_SERVER_URL }}',
        options: {
            'sonar.projectKey': '${{ SONAR_PROJECT_KEY }}',
            'sonar.projectName': '${{ SONAR_PROJECT_NAME }}',
            'sonar.projectVersion': '1.0',
            'sonar.sources': './src',
            // 'sonar.tests': './tests',
            'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
            'sonar.sourceEncoding': 'UTF-8',
        },
    },
    () => process.exit()
);