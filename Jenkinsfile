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
                      image: 924809052459.dkr.ecr.us-east-1.amazonaws.com/node:latest
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

                    volumes:
                    - name: kaniko-cache
                      emptyDir: {}
            '''
        }
    }

    // --- DECLARE OPTIONS --- 

    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '30'))
    }

    // --- DECLARE ENVIRONMENT ---

    environment{
        STAGING_API_ENDPOINT = 'https://staging.api.skillstorm-congo.com'
        PROD_API_ENDPOINT = 'https://api.skillstorm-congo.com'
        
        STAGING_HOST = 'https://staging.frontend.skillstorm-congo.com'
        PROD_HOST = 'https://frontend.skillstorm-congo.com'

        CLIENT_ID = credentials('GITHUB_APP_CLIENT_ID')
        PEM = credentials('GITHUB_APP_PEM')
        REVIEWER_GITHUB_USERNAMES = '"Anthowu07", "msabas1", "aldrich19"'
        TEST_BRANCH = 'testing-cohort-dev'
        MAIN_BRANCH = 'testing-cohort'
    }

    // --- STAGES ---

    stages{
        // --- COMMON BEFORE ---

        // Create backup of current S3
        stage('Create S3 Backup'){
            steps{
                container('kaniko'){
                    withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                        sh 'mkdir s3-backup'
                        sh 'aws s3 sync s3://budget-buddy-frontend s3-backup'
                    }
                }
            }
        }

        // Set namespace
        stage('Set Namespace') {
            steps {
                script {
                    if (env.BRANCH_NAME == "${TEST_BRANCH}") {
                        env.NAMESPACE = 'staging'
                    } else if (env.BRANCH_NAME == "${MAIN_BRANCH}") {
                        env.NAMESPACE = 'prod'
                    }
                }
            }
        }

        // Pulls all dependencies from git.
        stage('Pull Dependencies'){
            steps{
                sh 'git clone -b testing-cohort-dev https://github.com/My-Budget-Buddy/Budget-Buddy-Frontend-Testing.git'
                sh 'git clone https://github.com/My-Budget-Buddy/Budget-Buddy-Kubernetes.git'
            }
        }

        // --- TESTING-COHORT-DEV BUILDING ---

        // Builds the frontend for the staging environment.
        stage('Build frontend for Staging'){
            when{
                branch 'testing-cohort-dev'
            }

            steps{
                container('npm'){
                    sh 'chmod +x ./Budget-Buddy-Kubernetes/Scripts/BuildFrontend.sh'
                    sh './Budget-Buddy-Kubernetes/Scripts/BuildFrontend.sh ${STAGING_API_ENDPOINT}'
                }
            }
        }

        // --- TESTING-COHORT BUILDING ---

        // Builds the frontend.
        stage('Build frontend for Production'){
            when{
                branch 'testing-cohort'
            }

            steps{
                container('npm'){
                    sh 'chmod +x ./Budget-Buddy-Kubernetes/Scripts/BuildFrontend.sh'
                    sh './Budget-Buddy-Kubernetes/Scripts/BuildFrontend.sh ${PROD_API_ENDPOINT}'
                }
            }
        }

        // --- UNIT TESTING ---

        // Performs jest tests
        // stage('Jest Tests'){
        //     steps{
        //         container('npm'){
        //             sh 'npm run test:coverage'
        //         }
        //     }
        // }

        // SonarQube
        stage('Analyze Frontend'){
            environment{
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

        // --- TESTING-COHORT-DEV DEPLOYMENT ---

        // Deploy to staging S3
        stage('S3 Deployment for Staging'){
            when{
                branch 'testing-cohort-dev'
            }

            steps{
                container('kaniko'){
                    withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                        sh 'aws s3 sync dist s3://budget-buddy-frontend-staging'
                    }
                }
            }
        }

        // Retrieves the selenium/cucumber repository and runs the tests.
        stage('Staging Functional Tests'){
            steps{
                script {
                    // Run testing suite
                    container('maven'){
                        withCredentials([string(credentialsId: 'CUCUMBER_TOKEN', variable: 'CUCUMBER_TOKEN')]) {
                            sh '''
                                cd Budget-Buddy-Frontend-Testing/cucumber-selenium-tests
                                mvn clean test -Dheadless=true -Dmaven.test.failure.ignore=true -Dcucumber.publish.token=${CUCUMBER_TOKEN} -DfrontendUrl=${STAGING_HOST}
                            '''
                        }
                    }
                }
            }
        }

        // --- TESTING-COHORT DEPLOYMENT ---

        // Deploy to Production S3
        stage('S3 Deployment for Production'){
            when{
                branch 'testing-cohort'
            }

            steps{
                container('kaniko'){
                    withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                        sh 'aws s3 sync dist s3://budget-buddy-frontend'
                    }
                }
            }
        }

        // Trigger cloudfront refresh
        stage('Cloudfront Update'){
            when{
                branch 'testing-cohort'
            }

            steps{
                container('kaniko'){
                    withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS'){
                        sh 'aws cloudfront create-invalidation --distribution-id E2D9Z4H1DJNT0K --paths "/*"'
                    }
                }
            }
        }
    }

  // --- POST PIPELINE ---

  post {
    always {
        cleanWs()
    }

    success {
      script {
        handleSuccess()
      }
    }

    failure {
      script {
        handleFailure()
      }
    }
  }
}


// Function to handle success case
def handleSuccess() {
    if (env.BRANCH_NAME == "${TEST_BRANCH}") {
        def JWT = generateJWT()
        def GITHUB_TOKEN = retrieveAccessToken(JWT)
        createPullRequest(GITHUB_TOKEN)
    }
}

// Function to handle failure case
def handleFailure() {
    echo 'The pipeline failed.'
    echo 'Resetting S3'

    container('kaniko'){
        script{
            // Reset staging S3
            if(env.BRANCH_NAME.equals('testing-cohort-dev')){
                sh 'aws s3 sync s3-backup s3://budget-buddy-frontend-staging'
            }

            // Reset production S3
            if(env.BRANCH_NAME.equals('testing-cohort')){
                sh 'aws s3 sync s3-backup s3://budget-buddy-frontend'
            }
        }
    }

    echo 'Reverting last PR.'
    def JWT = generateJWT()
    def GITHUB_TOKEN = retrieveAccessToken(JWT)
    revertLastPullRequest(GITHUB_TOKEN)
}

// Function to generate JWT
def generateJWT() {
    def now = sh(script: 'date +%s', returnStdout: true).trim()
    def iat = (now.toInteger() - 60).toString()
    def exp = (now.toInteger() + 600).toString()

    echo "Current time: ${now}"
    echo "Issued at: ${iat}"
    echo "Expires at: ${exp}"

    return sh(script: """
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
}

// Function to retrieve access token
def retrieveAccessToken(JWT) {
    def tokenResponse = httpRequest(
        url: 'https://api.github.com/app/installations/54988601/access_tokens',
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: '*/*'],
            [name: 'Authorization', value: "Bearer ${JWT}"],
        ],
        contentType: 'APPLICATION_JSON'
    )

    if (tokenResponse.status == 201) {
        def jsonResponse = readJSON text: tokenResponse.content
        echo "Access token ${jsonResponse.token} created."
        return jsonResponse.token
    } else {
        error 'Access token retrieval failed, aborting pipeline'
    }
}

// Function to create pull request
def createPullRequest(GITHUB_TOKEN) {
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

    if (pullResponse.status == 201) {
        def jsonResponse = readJSON text: pullResponse.content
        int prNumber = jsonResponse.number
        echo "PR #${prNumber} created."
        requestReviewers(GITHUB_TOKEN, prNumber)
    } else {
        echo "Failed to create PR. Status: ${pullResponse.status}"
    }
}

// Function to request reviewers for the pull request
def requestReviewers(GITHUB_TOKEN, prNumber) {
    def reviewerResponse = httpRequest(
        url: "https://api.github.com/repos/My-Budget-Buddy/Budget-Buddy-${PASCAL_SERVICE_NAME}/pulls/${prNumber}/requested_reviewers",
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: 'application/vnd.github+json'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
            [name: 'X-GitHub-Api-Version', value: '2022-11-28']
        ],
        contentType: 'APPLICATION_JSON',
        requestBody: """
            {
                "reviewers": [${REVIEWER_GITHUB_USERNAMES}]
            }
        """
    )

    if (reviewerResponse.status == 201) {
        echo "Reviewers requested for PR #${prNumber}."
    } else {
        echo "Failed to request reviewers for PR #${prNumber}. Status: ${reviewerResponse.status}"
    }
}

// Function to revert last pull request
def revertLastPullRequest(GITHUB_TOKEN) {
    def getPullResponse = httpRequest(
        url: "https://api.github.com/repos/My-Budget-Buddy/Budget-Buddy-${PASCAL_SERVICE_NAME}/commits/${env.GIT_COMMIT}/pulls",
        httpMode: 'GET',
        customHeaders: [
            [name: 'Accept', value: '*/*'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
        ],
        contentType: 'APPLICATION_JSON'
    )

    if (getPullResponse.status == 200) {
        def jsonResponse = readJSON text: getPullResponse.content
        def pullRequest = jsonResponse[0]
        def prNumber = pullRequest.number
        def prNodeId = pullRequest.node_id
        def prTitle = pullRequest.title
        def prAuthor = pullRequest.user.login

        echo "Retrieved last PR #${prNumber}."

        def revertResponse = revertPullRequest(prNumber, prNodeId, prTitle, GITHUB_TOKEN)
        handleRevertResponse(revertResponse, prNumber, prAuthor, GITHUB_TOKEN)
    } else {
        error "Failed to retrieve last PR. Status: ${getPullResponse.status}"
    }
}

// Function to revert the pull request via GraphQL
def revertPullRequest(prNumber, prNodeId, prTitle, GITHUB_TOKEN) {
    return httpRequest(
        url: 'https://api.github.com/graphql',
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: '*/*'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
        ],
        contentType: 'APPLICATION_JSON',
        requestBody: """
            {
                "query": "mutation RevertPullRequest { \
                    revertPullRequest( \
                        input: { \
                            pullRequestId: \\"${prNodeId}\\", \
                            title: \\"Automated PR: Revert '${prTitle}' on failed pipeline run\\", \
                            draft: false, \
                            body: \\"This pull request was created automatically after a failed pipeline run. This pull request reverts PR #${prNumber}.\\" \
                        } \
                    ) { \
                        revertPullRequest { \
                            createdAt \
                            id \
                            number \
                            state \
                            title \
                            url \
                        } \
                        pullRequest { \
                            baseRefOid \
                            createdAt \
                            headRefOid \
                            id \
                            number \
                            state \
                            title \
                            url \
                        } \
                    } \
                }"
            }
        """
    )
}

// Function to handle the revert response
def handleRevertResponse(revertResponse, prNumber, prAuthor, GITHUB_TOKEN) {
    if (revertResponse.status == 400) {
        def jsonResponse = readJSON text: revertResponse.content
        echo "Failed to revert PR #${prNumber}. ${jsonResponse.errors[0].message}"
    } else if (revertResponse.status == 200) {
        def jsonResponse = readJSON text: revertResponse.content
        if (jsonResponse.errors != null) {
            error "Failed to revert PR #${prNumber}. ${jsonResponse.errors[0].message}"
        } else {
            echo "PR #${prNumber} reverted."
            requestReviewersForRevert(prAuthor, GITHUB_TOKEN, jsonResponse)
        }
    } else {
        error 'GraphQL request failed, aborting pipeline'
    }
}

// Function to request reviewers for the reverted pull request
def requestReviewersForRevert(prAuthor, GITHUB_TOKEN, jsonResponse) {
    def revertPrNumber = jsonResponse.data.revertPullRequest.revertPullRequest.number
    def revertReviewers = "${REVIEWER_GITHUB_USERNAMES}"

    // Convert the comma-separated string into a list of trimmed usernames (removing quotes and extra spaces)
    def reviewerList = revertReviewers.split(',').collect { it.trim().replaceAll('"', '') }

    // Check if prAuthor is not already in the list
    if (!reviewerList.contains(prAuthor) && prAuthor != null && prAuthor != 'jenkins_budgetbuddy') {
        revertReviewers += ", \"${prAuthor}\""
    }

    def revertRequestResponse = httpRequest(
        url: "https://api.github.com/repos/My-Budget-Buddy/Budget-Buddy-${PASCAL_SERVICE_NAME}/pulls/${revertPrNumber}/requested_reviewers",
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: 'application/vnd.github+json'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
            [name: 'X-GitHub-Api-Version', value: '2022-11-28']
        ],
        contentType: 'APPLICATION_JSON',
        requestBody: """
            {
                "reviewers": [${revertReviewers}]
            }
        """
    )

    if (revertRequestResponse.status == 201) {
        echo "Reviewers requested for revert PR #${revertPrNumber}."
    } else {
        echo "Failed to request reviewers for revert PR #${revertPrNumber}. Status: ${revertRequestResponse.status}"
    }
}
