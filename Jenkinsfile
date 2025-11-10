pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        BACKEND_IMAGE = 'customer-backend'
        FRONTEND_IMAGE = 'customer-frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "Checking out code from repository: ${env.GIT_URL}"
                    sh 'git rev-parse HEAD > .git/commit-hash'
                    sh 'cat .git/commit-hash'
                }
            }
        }
        
        stage('Backend Tests') {
            steps {
                dir('backend') {
                    script {
                        echo 'Installing backend dependencies...'
                        sh 'npm ci'
                        
                        echo 'Running backend tests...'
                        sh 'npm run test:run'
                    }
                }
            }
            post {
                always {
                    dir('backend') {
                        script {
                            // Archive test results if available
                            try {
                                junit '**/test-results.xml'
                            } catch (Exception e) {
                                echo "No test results XML found, skipping..."
                            }
                        }
                    }
                }
            }
        }
        
        stage('Frontend Tests') {
            steps {
                dir('frontend') {
                    script {
                        echo 'Installing frontend dependencies...'
                        sh 'npm ci'
                        
                        echo 'Running frontend tests...'
                        sh 'npm run test:run'
                    }
                }
            }
            post {
                always {
                    dir('frontend') {
                        script {
                            // Archive test results if available
                            try {
                                junit '**/test-results.xml'
                            } catch (Exception e) {
                                echo "No test results XML found, skipping..."
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    echo 'Building backend Docker image...'
                    sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend"
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building frontend Docker image...'
                    sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ./frontend"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Ensuring Docker network exists...'
                    sh 'docker network create app-network || true'
                    
                    echo 'Stopping existing containers...'
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} down || true"
                    
                    echo 'Starting application services...'
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d --build"
                    
                    echo 'Waiting for services to be healthy...'
                    sleep(time: 30, unit: 'SECONDS')
                    
                    echo 'Checking service health...'
                    sh '''
                        echo "Checking backend health..."
                        for i in {1..10}; do
                            if curl -f http://localhost:3001/health; then
                                echo "Backend is healthy!"
                                exit 0
                            fi
                            echo "Waiting for backend to be ready... ($i/10)"
                            sleep 5
                        done
                        echo "Backend health check failed!"
                        exit 1
                    '''
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                script {
                    echo 'Cleaning up old Docker images...'
                    sh '''
                        # Remove dangling images
                        docker image prune -f
                        
                        # Keep only last 5 builds
                        docker images ${BACKEND_IMAGE} --format "{{.ID}} {{.Tag}}" | grep -v latest | tail -n +6 | awk '{print $1}' | xargs -r docker rmi -f || true
                        docker images ${FRONTEND_IMAGE} --format "{{.ID}} {{.Tag}}" | grep -v latest | tail -n +6 | awk '{print $1}' | xargs -r docker rmi -f || true
                    '''
                }
            }
        }
    }
    
    post {
        success {
            script {
                echo "Pipeline succeeded! Build #${BUILD_NUMBER}"
                echo "Application deployed successfully"
                echo "Frontend: http://localhost:3000"
                echo "Backend: http://localhost:3001"
            }
        }
        failure {
            script {
                echo "Pipeline failed! Build #${BUILD_NUMBER}"
                echo "Check the logs above for details"
            }
        }
        always {
            script {
                echo "Pipeline completed. Build #${BUILD_NUMBER}"
                // Clean up workspace if needed
                cleanWs()
            }
        }
    }
}

