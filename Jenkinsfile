pipeline{
    agent any

    stages{

        stage('Build Backend'){
            steps{
                sh '''
                    cd backend
                    npm ci
                    npm test
                '''
            }
        }

        stage('Build Frontend'){
            steps{
                sh '''
                    cd frontend
                    npm ci
                    npm run lint
                    npm test
                '''
            }
        }
        stage('Docker Build'){
            steps{
                sh '''
                    docker compose build  
                '''
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    file(
                        credentialsId: "backend-env-file",
                        variable: "BACKEND_ENV_FILE"
                    )
                ]){
                    sh '''
                    cp "$BACKEND_ENV_FILE" backend/.env
                    docker compose up -d --remove-orphans
                    '''
                }
            }
        }
    }

    post {
        success{
            echo 'Project deployed successfully'
        }
        failure{
            echo 'Project deployment failed'
        }
    }
}