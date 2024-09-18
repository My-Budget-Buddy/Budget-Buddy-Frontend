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

    stages{
        // changed
        // Removes previous builds from the instance.
        stage('Clean space'){
            steps {
                // Remove lingering selenium/cucumber repository to guarantee latest test suite
                sh '''
                    if [ -d "Budget-Buddy-Frontend-Testing" ]; then
                        echo "Removing selenium/cucumber repository..."
                        rm -rf Budget-Buddy-Frontend-Testing
                    else
                        echo "Selenium/cucumber repository does not exist, skipping deletion."
                    fi
                '''

                // Remove lingering dist files to guarantee latest build
                sh '''
                    if [ -d "dist" ]; then
                        echo "Removing previous distribution..."
                        rm -rf dist
                    else
                        echo "No previous distributions found."
                    fi
                '''
            }
        }

        // Builds the frontend.
        stage('Build frontend'){
            steps{
                container('npm'){
                    sh 'npm install && npm run build'
                }
            }
        }

        // SonarQube
        stage('Test and Analyze Frontend'){
            steps{
                container('npm'){
                    script{
                        withSonarQubeEnv('SonarCloud'){
                            sh '''
                            npm run test --coverage
                            npx sonar-scanner \
                                -Dsonar.projectKey=my-budget-buddy \
                                -Dsonar.projectName=Budget-Buddy-Frontend \
                                -Dsonar.sources=src \
                                -Dsonar.exclusions=**/dist/** \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                            '''
                        }
                    }
                }
            }
        }

        // Performs jest tests
        stage('Jest Tests'){
            steps{
                sh 'echo "!!! JEST TESTS NOT INTEGRATED !!!'
            }
        }

        // Retrieves the selenium/cucumber repository and runs the tests.
        stage('Selenium/Cucumber Tests'){
            steps{
                container('maven'){
                    withCredentials([string(credentialsId: "CUCUMBER_PUBLISH_TOKEN", variable: "CUCUMBER_TOKEN")]){
                        sh '''
                        git clone https://github.com/My-Budget-Buddy/Budget-Buddy-Frontend-Testing.git
                        cd Budget-Buddy-Frontend-Testing
                        mvn test -Dheadless=true -Dcucumber.publish.token=${CUCUMBER_TOKEN}
                        '''
                    }
                }
            }
        }

        // Deploy to S3
        stage('S3 Deployment'){
            steps{
                withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                    sh 'aws s3 sync dist s3://budget-buddy-frontend'
                }
            }
        }

        // Invalidate cloudfront and trigger reupload
        stage('Cloudfront Update'){
            steps{
                withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                    sh 'aws cloudfront create-invalidation --distribution-id E2D9Z4H1DJNT0K --paths "/*"'
                }
            }
        }
    }
}