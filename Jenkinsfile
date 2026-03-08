pipeline {
    agent any

    stages {

        stage('Clonar repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend/api') {
                    bat 'dotnet restore'
                    bat 'dotnet build'
                }
            }
        }

    }

    post {
        success {
            echo 'Build completado correctamente'
        }
        failure {
            echo 'El build falló'
        }
    }
}