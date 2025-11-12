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
          // Use short commit SHA for immutable tag
          if (isUnix()) {
            def output = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
            env.IMAGE_TAG = output ?: 'latest'
          } else {
            def output = bat(returnStdout: true, script: '@git rev-parse --short HEAD').trim()
            env.IMAGE_TAG = output ?: 'latest'
          }
          echo "Using image tag: ${env.IMAGE_TAG}"
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
            bat "docker build -t %DOCKERHUB_USER%/blog-frontend:%IMAGE_TAG% -t %DOCKERHUB_USER%/blog-frontend:latest ./frontend"
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
            bat "docker build -t %DOCKERHUB_USER%/blog-backend:%IMAGE_TAG% -t %DOCKERHUB_USER%/blog-backend:latest ./backend"
          }
        }
      }
    }

    stage('Docker Login & Push') {
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
                docker push %DOCKERHUB_USER%/blog-frontend:%IMAGE_TAG%
                docker push %DOCKERHUB_USER%/blog-frontend:latest
                docker push %DOCKERHUB_USER%/blog-backend:%IMAGE_TAG%
                docker push %DOCKERHUB_USER%/blog-backend:latest
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
      echo "- ${env.DOCKERHUB_USER}/blog-frontend:${env.IMAGE_TAG}"
      echo "- ${env.DOCKERHUB_USER}/blog-frontend:latest"
      echo "- ${env.DOCKERHUB_USER}/blog-backend:${env.IMAGE_TAG}"
      echo "- ${env.DOCKERHUB_USER}/blog-backend:latest"
    }
  }
}
