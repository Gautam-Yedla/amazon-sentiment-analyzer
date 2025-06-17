pipeline {
  agent any

  environment {
    BACKEND_DIR = 'backend'
    FRONTEND_DIR = 'frontend'
    DOCKER_DIR = 'docker'
    VENV_PATH = 'venv/bin/activate'
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
          echo "📦 Setting up Python environment and installing backend dependencies..."
          sh '''
            python -m venv venv
            . venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt
          '''
        }
        dir("${FRONTEND_DIR}") {
          echo "📦 Installing frontend dependencies..."
          sh 'npm install'
        }
      }
    }

    stage('Download Data') {
      steps {
        dir("${BACKEND_DIR}/data") {
          echo "⬇️ Downloading training and test data (if not cached)..."
          sh '''
            . ../venv/bin/activate
            pip install gdown
            ./download_data.sh
          '''
        }
      }
    }

    stage('Train Model') {
      steps {
        dir("${BACKEND_DIR}/model") {
          echo "🧠 Training ML model..."
          sh '''
            . ../venv/bin/activate
            python train_model.py
          '''
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir("${FRONTEND_DIR}") {
          echo "⚙️ Building React frontend..."
          sh 'npm run build'
        }
      }
    }

    stage('Docker Build') {
      steps {
        echo "🐳 Building Docker containers..."
        sh 'docker compose -f docker/docker-compose.yml build'
      }
    }
  }

  post {
    success {
      echo '✅ Build, training, and Docker build completed successfully!'
    }
    failure {
      echo '❌ Something went wrong.'
    }
  }
}
