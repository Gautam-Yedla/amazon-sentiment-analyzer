pipeline {
  agent any

  environment {
    BACKEND_DIR = 'backend'
    FRONTEND_DIR = 'frontend'
    DOCKER_DIR = 'docker'
    VENV_PATH = 'venv\\Scripts\\activate.bat'
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
          bat 'python -m venv venv && call venv\\Scripts\\activate.bat && pip install -r requirements.txt'
        }
        dir("${FRONTEND_DIR}") {
          echo "📦 Installing frontend dependencies..."
          bat 'npm install'
        }
      }
    }

    stage('Train Model') {
      steps {
        dir("${BACKEND_DIR}\\model") {
          echo "🧠 Training ML model..."
          // activate virtual environment from backend/venv and run training
          bat 'call ..\\venv\\Scripts\\activate.bat && python train_model.py'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir("${FRONTEND_DIR}") {
          echo "⚙️ Building React frontend..."
          bat 'npm run build'
        }
      }
    }

    stage('Docker Build') {
      steps {
        echo "🐳 Building Docker containers..."
        bat 'docker-compose build'
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
