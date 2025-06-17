pipeline {
  agent any

  environment {
    BACKEND_DIR = 'backend'
    FRONTEND_DIR = 'frontend'
    DOCKER_DIR = 'docker'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Gautam-Yedla/amazon-sentiment-analyzer.git'
      }
    }


    stage('Install Dependencies') {
      steps {
        dir("${BACKEND_DIR}") {
          sh 'python -m venv venv && . venv/bin/activate && pip install -r requirements.txt'
        }
        dir("${FRONTEND_DIR}") {
          sh 'npm install'
        }
      }
    }

    stage('Train Model') {
      steps {
        dir("${BACKEND_DIR}/model") {
          sh '. ../../venv/bin/activate && python train_model.py'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir("${FRONTEND_DIR}") {
          sh 'npm run build'
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker-compose build'
      }
    }

    // Optional: Push to DockerHub
    // stage('Docker Push') { ... }

    // Optional: Deploy to server
    // stage('Deploy') { ... }
  }

  post {
    success {
      echo '✅ Build, training and Docker build completed successfully!'
    }
    failure {
      echo '❌ Something went wrong.'
    }
  }
}
