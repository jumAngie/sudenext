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
                dir('backend/api/SUDENEXT_API') {
                    bat 'dotnet restore "SUDENEXT_API.sln"'
                    bat 'dotnet build "SUDENEXT_API.sln"'
                }
            }
        }

        stage('Tests Backend') {
            steps {
                dir('backend/api/SUDENEXT_API') {
                    bat 'dotnet test "SUDENEXT_API.sln"'
                }
            }
        }

    }

    post {
        success {
            echo 'Build y pruebas completadas correctamente'
        }
        failure {
            echo 'El pipeline falló'
        }
    }
}