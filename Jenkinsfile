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
        checkout scm
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
        expression { return params.DOCKERHUB_CREDENTIALS_ID?.trim() }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: params.DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          script {
            if (isUnix()) {
              sh """
                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

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
