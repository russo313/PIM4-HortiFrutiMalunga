Write-Host '=== Inicializacao do backend Hortifruti ==='
Write-Host '1) Preparando containers (PostgreSQL + API)...'

try {
    docker compose down --remove-orphans | Out-Null
    docker compose up --build
} catch {
    Write-Error 'Falha ao executar docker compose. Verifique o Docker Desktop e tente novamente.'
    exit 1
}

