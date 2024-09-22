pipeline{
    agent {
        kubernetes{
            yaml '''
                apiVersion: v1
                kind: Pod
                spec:
                    containers:
                    - name: kaniko
                      image: 924809052459.dkr.ecr.us-east-1.amazonaws.com/kaniko:latest
                      imagePullPolicy: Always
                      volumeMounts:
                      - name: kaniko-cache
                        mountPath: /kaniko/.cache
                      env:
                      - name: AWS_REGION
                        valueFrom:
                            secretKeyRef:
                                name: ecr-login
                                key: AWS_REGION
                      - name: AWS_ACCESS_KEY_ID
                        valueFrom:
                            secretKeyRef:
                                name: ecr-login
                                key: AWS_ACCESS_KEY_ID
                      - name: AWS_SECRET_ACCESS_KEY
                        valueFrom:
                            secretKeyRef:
                                name: ecr-login
                                key: AWS_SECRET_ACCESS_KEY
                      command:
                      - sleep
                      args:
                      - '9999999'
                      tty: true

                    - name: npm
                      image: node:latest
                      imagePullPolicy: Always
                      volumeMounts:
                      - name: kaniko-cache
                        mountPath: /kaniko/.cache
                      command:
                        - sleep
                      args:
                        - '9999999'
                      tty: true

                    - name: maven
                      image: 924809052459.dkr.ecr.us-east-1.amazonaws.com/maven:latest
                      imagePullPolicy: Always
                      volumeMounts:
                        - name: kaniko-cache
                          mountPath: /kaniko/.cache
                      command:
                        - sleep
                      args:
                        - '9999999'
                      tty: true

#                     - name: postgres
#                      image: postgres:13.16-alpine3.20
#                      imagePullPolicy: Always
#                      volumeMounts:
#                        - name: kaniko-cache
#                          mountPath: /kaniko/.cache

                    volumes:
                    - name: kaniko-cache
                      emptyDir: {}
            '''
        }
    }

    environment{
        STAGING_API_ENDPOINT = 'https://api.skillstorm-congo.com'
        PROD_API_ENDPOINT = 'https://api.skillstorm-congo.com'
    }

    stages{
        // Pulls all dependencies from git.
        stage('Pull Dependencies'){
            steps{
                sh 'git clone https://github.com/My-Budget-Buddy/Budget-Buddy-Frontend-Testing.git'
            }
        }

        // Builds the frontend.
        stage('Build frontend for Staging'){
            when{
                branch 'testing-cohort-dev'
            }

            steps{
                container('npm'){
                    sh 'echo "VITE_BASE_API_ENDPOINT=${STAGING_API_ENDPOINT}" > .env'
                    sh 'npm install && npm run build'
                }
            }
        }

        // Builds the frontend.
        stage('Build frontend for Production'){
            when{
                branch 'testing-cohort'
            }

            steps{
                container('npm'){
                    sh 'echo "VITE_BASE_API_ENDPOINT=${PROD_API_ENDPOINT}" > .env'
                    sh 'npm install && npm run build'
                }
            }
        }

        // SonarQube
        stage('Analyze Frontend'){
            environment{
                SONAR_SERVER_URL = 'https://sonarcloud.io/'
                SONAR_TOKEN = credentials('SONAR_TOKEN')
                SONAR_PROJECT_NAME = 'Budget-Buddy-Frontend'
                SONAR_PROJECT_KEY = 'My-Budget-Buddy_Budget-Buddy-Frontend'
            }

            steps{
                container('npm'){
                    script{
                        withSonarQubeEnv('SonarCloud'){
                            sh '''
                            node sonarqube-scanner.cjs
                            '''
                        }
                    }
                }
            }
        }

        // Performs jest tests - will always fail until tests are defined.
        // stage('Jest Tests'){
        //     steps{
        //         container('npm'){
        //             sh 'npm run test --coverage'
        //         }
        //     }
        // }

        // Retrieves the selenium/cucumber repository and runs the tests.
        stage('Selenium/Cucumber Tests'){
            steps{
                container('maven'){
                    withCredentials([string(credentialsId: "CUCUMBER_TOKEN", variable: "CUCUMBER_TOKEN")]){
                        directory('Budget-Buddy-Frontend-Testing'){
                            sh 'mvn test -Dheadless=true -Dcucumber.publish.token=${CUCUMBER_TOKEN}'
                        }
                    }
                }
            }
        }

        // Deploy to S3
        stage('S3 Deployment for Staging'){
            when{
                branch 'testing-cohort-dev'
            }

            steps{
                withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                    sh 'aws s3 sync dist s3://budget-buddy-frontend-staging'
                }
            }
        }

        // Deploy to S3
        stage('S3 Deployment for Production'){
            when{
                branch 'testing-cohort'
            }

            steps{
                withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                    sh 'aws s3 sync dist s3://budget-buddy-frontend'
                }
            }
        }

        // Invalidate cloudfront and trigger reupload
        stage('Cloudfront Update'){
            when{
                branch 'testing-cohort'
            }

            steps{
                withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                    sh 'aws cloudfront create-invalidation --distribution-id E2D9Z4H1DJNT0K --paths "/*"'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}