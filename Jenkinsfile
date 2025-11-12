pipeline {
  agent any

  parameters {
    string(name: 'DOCKERHUB_USER', defaultValue: 'shalika2002', description: 'Docker Hub username (namespace) to push images to')
    string(name: 'DOCKERHUB_CREDENTIALS_ID', defaultValue: 'dockerhub-creds', description: 'Jenkins Credentials ID for Docker Hub (Username with password or token)')
  }

  environment {
    // Computed during the run
    IMAGE_TAG = ''
  }

  options {
    // timestamps() and ansiColor() require extra plugins (Timestamper, AnsiColor).
    // Removing them for compatibility with minimal Jenkins installations.
    buildDiscarder(logRotator(numToKeepStr: '20'))
    skipDefaultCheckout(true)
  }

  triggers {
    // Prefer webhooks; polling is a fallback. You may remove this if using webhook only.
    pollSCM('H/15 * * * *')
  }

  stages {
    stage('Checkout') {
      steps {
        script {
          // Harden git fetch against flaky networks and reduce payload size
          if (isUnix()) {
            sh 'git config --global http.version HTTP/1.1 || true'
            sh 'git config --global core.compression 0 || true'
          } else {
            bat 'git config --global http.version HTTP/1.1'
          }
          retry(3) {
            checkout([
              $class: 'GitSCM',
              branches: [[name: '*/main']],
              userRemoteConfigs: [[url: 'https://github.com/Shalika2002/Blog-App-DevOps.git']],
              extensions: [
                [$class: 'CloneOption', shallow: true, depth: 10, noTags: false, reference: '', timeout: 20],
                [$class: 'CleanCheckout']
              ]
            ])
          }
        }
      }
    }

    stage('Compute image tag') {
      steps {
        script {
          // Prefer Jenkins-provided GIT_COMMIT; fall back to git; last resort build number
          def candidates = []
          if (env.GIT_COMMIT) { candidates << env.GIT_COMMIT.take(7) }
          def out = ''
          if (isUnix()) {
            out = sh(returnStdout: true, script: 'git rev-parse --short HEAD || true').trim()
          } else {
            out = bat(returnStdout: true, script: '@git rev-parse --short HEAD').trim()
          }
          if (out) { candidates << out }
          def fallback = "build-${env.BUILD_NUMBER ?: '0'}"
          def picked = candidates.find { it && it.trim() && it.toLowerCase() != 'null' } ?: fallback
          env.IMAGE_TAG = picked
          echo "Using image tag: ${env.IMAGE_TAG} (GIT_COMMIT=${env.GIT_COMMIT ?: 'n/a'})"
        }
      }
    }

    stage('Docker Build - Frontend') {
      steps {
        script {
          if (isUnix()) {
            sh """
              docker build \
                -t ${params.DOCKERHUB_USER}/blog-frontend:${env.IMAGE_TAG} \
                -t ${params.DOCKERHUB_USER}/blog-frontend:latest \
                ./frontend
            """
          } else {
            bat "docker build -t ${params.DOCKERHUB_USER}/blog-frontend:${env.IMAGE_TAG} -t ${params.DOCKERHUB_USER}/blog-frontend:latest ./frontend"
          }
        }
      }
    }

    stage('Docker Build - Backend') {
      steps {
        script {
          if (isUnix()) {
            sh """
              docker build \
                -t ${params.DOCKERHUB_USER}/blog-backend:${env.IMAGE_TAG} \
                -t ${params.DOCKERHUB_USER}/blog-backend:latest \
                ./backend
            """
          } else {
            bat "docker build -t ${params.DOCKERHUB_USER}/blog-backend:${env.IMAGE_TAG} -t ${params.DOCKERHUB_USER}/blog-backend:latest ./backend"
          }
        }
      }
    }

    stage('Docker Login & Push') {
      when {
        allOf {
          expression { return params.DOCKERHUB_CREDENTIALS_ID?.trim() }
          branch 'main'
        }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: params.DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          script {
            if (isUnix()) {
              // Avoid Groovy interpolation with secrets
              sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
              sh """
                docker push ${params.DOCKERHUB_USER}/blog-frontend:${env.IMAGE_TAG}
                docker push ${params.DOCKERHUB_USER}/blog-frontend:latest

                docker push ${params.DOCKERHUB_USER}/blog-backend:${env.IMAGE_TAG}
                docker push ${params.DOCKERHUB_USER}/blog-backend:latest
              """
            } else {
              bat """
                @echo off
                echo %DOCKER_PASS% | docker login -u "%DOCKER_USER%" --password-stdin
                docker push ${params.DOCKERHUB_USER}/blog-frontend:${env.IMAGE_TAG}
                docker push ${params.DOCKERHUB_USER}/blog-frontend:latest
                docker push ${params.DOCKERHUB_USER}/blog-backend:${env.IMAGE_TAG}
                docker push ${params.DOCKERHUB_USER}/blog-backend:latest
              """
            }
          }
        }
      }
    }

    stage('Smoke Test - Backend') {
      steps {
        script {
          if (isUnix()) {
            sh """
              set -e
              docker network create snaplink-ci || true
              docker rm -f ci_mongo ci_backend || true
              docker run -d --name ci_mongo --network snaplink-ci mongo:6
              # give mongo a moment
              sleep 5
              docker run -d --name ci_backend --network snaplink-ci -p 3000:3000 ${params.DOCKERHUB_USER}/blog-backend:${env.IMAGE_TAG}
              # wait for backend up to 60s
              for i in $(seq 1 30); do
                if curl -fsS http://localhost:3000/posts >/dev/null 2>&1; then echo "backend ok"; ok=1; break; fi;
                sleep 2;
              done
              test "$ok" = "1"
            """
          } else {
            echo 'Smoke test skipped on Windows agent.'
          }
        }
      }
      post {
        always {
          script {
            if (isUnix()) {
              sh 'docker rm -f ci_backend ci_mongo || true && docker network rm snaplink-ci || true'
            }
          }
        }
      }
    }
  }

  post {
    always {
      script {
        if (isUnix()) {
          sh 'docker logout || true'
        } else {
          bat 'docker logout || exit /b 0'
        }
      }
      echo "Build finished. Images:"
      echo "- ${params.DOCKERHUB_USER}/blog-frontend:${env.IMAGE_TAG}"
      echo "- ${params.DOCKERHUB_USER}/blog-frontend:latest"
      echo "- ${params.DOCKERHUB_USER}/blog-backend:${env.IMAGE_TAG}"
      echo "- ${params.DOCKERHUB_USER}/blog-backend:latest"
    }
  }
}
