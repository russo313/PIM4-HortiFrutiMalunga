Write-Host "=== Inicialização do backend Hortifruti ==="
Write-Host "1) Garantindo que o SQL Server do Docker esteja em execução..."

try {
    docker compose up -d sqlserver | Out-Null
} catch {
    Write-Warning "Não foi possível comunicar com o Docker. Abra o Docker Desktop e aguarde até que ele finalize a inicialização, depois execute novamente .\start-api.ps1."
    exit 1
}

function Test-Port($hostname, $port) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $async = $client.BeginConnect($hostname, $port, $null, $null)
        if (-not $async.AsyncWaitHandle.WaitOne(1000)) {
            $client.Close()
            return $false
        }
        $client.EndConnect($async)
        $client.Close()
        return $true
    } catch {
        return $false
    }
}

$timeoutSeconds = 60
$intervalSeconds = 2
$elapsed = 0

while ($elapsed -lt $timeoutSeconds -and -not (Test-Port "127.0.0.1" 1433)) {
    Start-Sleep -Seconds $intervalSeconds
    $elapsed += $intervalSeconds
}

if ($elapsed -ge $timeoutSeconds) {
    Write-Error "SQL Server não respondeu na porta 1433 após $timeoutSeconds segundos. Verifique o Docker (docker compose ps) e tente novamente."
    exit 1
}

Write-Host "2) Subindo a API (porta 5254). Mantenha esta janela aberta enquanto utilizar o front-end."
dotnet run --project "api/Hortifruti.Api" --urls "http://localhost:5254"
