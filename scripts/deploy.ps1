<#
.SYNOPSIS
  Skrypt do wdrażania kontenera Docker na Windows (PowerShell).
.DESCRIPTION
  Domyślne wartości: HostPort=5000, ContainerPort=5000.
.PARAMETER HostPort
  Port hosta (domyślnie 5000)
.PARAMETER ContainerPort
  Port w kontenerze (domyślnie 5000)
.PARAMETER Help
  Pokaż pomoc
.EXAMPLE
  .\scripts\deploy.ps1 -HostPort 5000 -ContainerPort 5000
#>
[CmdletBinding()]
param(
    [int]$HostPort = 5000,
    [int]$ContainerPort = 5000,
    [switch]$Help
)

function Show-Usage {
    Write-Host "Użycie: deploy.ps1 [-HostPort <N>] [-ContainerPort <N>] [-Help]" -ForegroundColor Cyan
    Write-Host "Opcje:`n  -HostPort <N>       port hosta (domyślnie: 5000)`n  -ContainerPort <N>  port w kontenerze (domyślnie: 5000)`n  -Help               pokaż ten komunikat`n"
}

if ($Help) {
    Show-Usage
    exit 0
}

$Container = 'symfi-api'
$Image = 'kttrez/symfi-api:latest'
$EnvVars = @("PROXY_DOWNLOAD_ENABLED=true", "USE_API_V2=true")

Write-Host "Uruchamiam deploy.ps1 dla kontenera '$Container' (HostPort=$HostPort, ContainerPort=$ContainerPort)" -ForegroundColor Green

# Sprawdź dostępność Dockera
Write-Host "Sprawdzam dostępność Dockera..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker nie jest zainstalowany lub nie jest dostępny w PATH. Zainstaluj Docker Desktop i spróbuj ponownie."
    exit 1
}

try {
    # stop i usuń istniejący kontener (jeśli istnieje)
    Write-Host "Sprawdzam istniejące kontenery o nazwie '$Container'..."
    $existing = (& docker ps -a --filter "name=^/$Container$" -q) -join ""
    if (-not [string]::IsNullOrWhiteSpace($existing)) {
        Write-Host "Znaleziono istniejący kontener '$Container' (id: $existing), zatrzymuję..."
        & docker stop $Container | Out-Null
        Write-Host "Usuwam kontener '$Container'..."
        & docker rm $Container | Out-Null
    } else {
        Write-Host "Brak istniejącego kontenera o nazwie '$Container'."
    }

    # usuń istniejący obraz jeśli jest
    Write-Host "Sprawdzam istniejący obraz '$Image'..."
    $existingImage = (& docker images -q $Image) -join ""
    if (-not [string]::IsNullOrWhiteSpace($existingImage)) {
        Write-Host "Znaleziono istniejący obraz '$Image' (id: $existingImage), usuwam..."
        & docker rmi -f $Image | Out-Null
    } else {
        Write-Host "Brak istniejącego obrazu '$Image'."
    }

    # pobierz najnowszy obraz
    Write-Host "Pobieram najnowszy obraz '$Image' z Docker Hub..."
    & docker pull $Image

    # uruchom nowy kontener
    Write-Host "Uruchamiam nowy kontener '$Container' z portem $HostPort:$ContainerPort i zmiennymi środowiskowymi..."
    $runArgs = @("run", "-d", "--name", $Container, "-p", "$HostPort`:$ContainerPort", "--restart", "unless-stopped")
    foreach ($ev in $EnvVars) {
        $runArgs += "-e"
        $runArgs += $ev
    }
    $runArgs += $Image

    Write-Host "Wykonuję: docker $($runArgs -join ' ')"
    & docker @runArgs

    Write-Host "Gotowe. Kontener '$Container' powinien działać." -ForegroundColor Green
    Write-Host "Sprawdź logi: docker logs -f $Container"
}
catch {
    Write-Error "Wystąpił błąd podczas wykonywania operacji Docker: $_"
    exit 2
}

