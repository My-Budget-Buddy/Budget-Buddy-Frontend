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

        CLIENT_ID = credentials('GITHUB_APP_CLIENT_ID')
        PEM = credentials('GITHUB_APP_PEM')
        REVIEWER_GITHUB_USERNAMES = "'Anthowu07', 'msabas1', 'aldrich19'"
        TEST_BRANCH = 'testing-cohort-dev'
        MAIN_BRANCH = 'testing-cohort'
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

    success {
      script {
       if (env.BRANCH_NAME == 'testing-cohort') {
        def now = sh(script: 'date +%s', returnStdout: true).trim()
        def iat = (now.toInteger() - 60).toString()
        def exp = (now.toInteger() + 600).toString()

        echo "Current time: ${now}"
        echo "Issued at: ${iat}"
        echo "Expires at: ${exp}"

        // Generate JWT
        def JWT = sh(script: """
            #!/bin/bash
            client_id="${CLIENT_ID}"
            pem="${PEM}"
            iat="${iat}"
            exp="${exp}"
            b64enc() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
            header=\$(echo -n '{"typ":"JWT","alg":"RS256"}' | b64enc)
            payload=\$(echo -n "{\\"iat\\":\${iat},\\"exp\\":\${exp},\\"iss\\":\\"\${client_id}\\"}" | b64enc)
            header_payload="\${header}.\${payload}"

            pem_file=\$(mktemp)
            echo "\${pem}" > "\${pem_file}"

            signature=\$(echo -n "\${header_payload}" | openssl dgst -sha256 -sign "\${pem_file}" | b64enc)
            JWT="\${header_payload}.\${signature}"
            rm -f "\${pem_file}"
            echo "\${JWT}"
        """, returnStdout: true).trim()
        echo "Generated JWT: ${JWT}"

  
          // Retrieve access token
          def tokenResponse = httpRequest(
                    url: "https://api.github.com/app/installations/54988601/access_tokens",
                    httpMode: 'POST',
                    customHeaders: [
                        [name: 'Accept', value: '*/*'],
                        [name: 'Authorization', value: "Bearer ${JWT}"],
                    ],
                    contentType: 'APPLICATION_JSON'
                )
        
        def GITHUB_TOKEN = null
        
        if (tokenResponse.status == 201) { // 201 is the status code for created
          def jsonResponse = readJSON text: tokenResponse.content
          GITHUB_TOKEN = jsonResponse.token

          echo "Access token ${GITHUB_TOKEN} created."
        } else {
            error "Access token retrieval failed, aborting pipeline"
        }

          
        // Create the Pull Request
        def pullResponse = httpRequest(
                    url: "https://api.github.com/repos/My-Budget-Buddy/Budget-Buddy-${PASCAL_SERVICE_NAME}/pulls",
                    httpMode: 'POST',
                    customHeaders: [
                        [name: 'Accept', value: '*/*'],
                        [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
                    ],
                    contentType: 'APPLICATION_JSON',
                    requestBody: """
                        {
                            "title": "Automated PR: Pipeline successful",
                            "head": "${TEST_BRANCH}",
                            "base": "${MAIN_BRANCH}",
                            "body": "This pull request was created automatically after a successful pipeline run."
                        }
                    """
                )

        // Extract PR number from the response
        if (pullResponse.status == 201) { // 201 is the status code for created
          def jsonResponse = readJSON text: pullResponse.content
          int prNumber = jsonResponse.number

          echo "PR #${prNumber} created."

          // Request Reviewers for the Pull Request
          String reviewerApiUrl = "https://api.github.com/repos/My-Budget-Buddy/Budget-Buddy-${PASCAL_SERVICE_NAME}/pulls/${prNumber}/requested_reviewers"
          String reviewerPayload = """
                {
                    "reviewers": [${REVIEWER_GITHUB_USERNAMES}]
                }
                """

          def reviewerResponse = httpRequest(
                    url: reviewerApiUrl,
                    httpMode: 'POST',
                    customHeaders: [
                        [name: 'Accept', value: 'application/vnd.github+json'],
                        [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
                        [name: 'X-GitHub-Api-Version', value: '2022-11-28']
                    ],
                    contentType: 'APPLICATION_JSON',
                    requestBody: reviewerPayload
                )

          if (reviewerResponse.status == 201) {
              echo "Reviewers requested for PR #${prNumber}."
          } else {
              echo "Failed to request reviewers for PR #${prNumber}. Status: ${reviewerResponse.status}"
          }
        } else {
              echo "Failed to create PR. Status: ${response.status}"
        }
      }
      }
    }

    failure {
      echo 'The pipeline failed. No pull request created.'
    }
  }
}