@echo off
rem Użycie: deploy.cmd [HostPort] [ContainerPort]

setlocal enabledelayedexpansion

rem Help
if "%1"=="-h" goto usage
if "%1"=="/h" goto usage
if "%1"=="--help" goto usage
if "%1"=="/?" goto usage

rem Domyślne porty
set HOST_PORT=%1
if "%HOST_PORT%"=="" set HOST_PORT=5000
set CONTAINER_PORT=%2
if "%CONTAINER_PORT%"=="" set CONTAINER_PORT=5000

set CONTAINER=symfi-api
set IMAGE=kttrez/symfi-api:latest

echo Uruchamiam deploy.cmd dla kontenera "%CONTAINER%" (HostPort=%HOST_PORT%, ContainerPort=%CONTAINER_PORT%)

echo Sprawdzam dostępność Dockera...
where docker >nul 2>&1
if errorlevel 1 (
  echo Docker nie jest zainstalowany lub nie jest w PATH. Zainstaluj Docker Desktop i spróbuj ponownie.
  exit /b 1
)

echo.
rem Stop i usuń istniejący kontener (jeśli istnieje)
set "EXISTING="
for /f "delims=" %%i in ('docker ps -a --filter "name=%CONTAINER%" -q 2^>nul') do set EXISTING=%%i
if defined EXISTING (
  echo Znaleziono istniejący kontener "%CONTAINER%" (id: %EXISTING%), zatrzymuję...
  docker stop %CONTAINER% >nul 2>&1
  echo Usuwam kontener "%CONTAINER%"...
  docker rm %CONTAINER% >nul 2>&1
) else (
  echo Brak istniejącego kontenera o nazwie "%CONTAINER%".
)

echo.
rem Usuń istniejący obraz jeśli jest
set "EXISTIMG="
for /f "delims=" %%i in ('docker images -q %IMAGE% 2^>nul') do set EXISTIMG=%%i
if defined EXISTIMG (
  echo Znaleziono istniejący obraz "%IMAGE%" (id: %EXISTIMG%), usuwam...
  docker rmi -f %IMAGE% >nul 2>&1
) else (
  echo Brak istniejącego obrazu "%IMAGE%".
)

echo.
echo Pobieram najnowszy obraz "%IMAGE%"...
docker pull %IMAGE%

echo.
echo Uruchamiam nowy kontener "%CONTAINER%" z portem %HOST_PORT%:%CONTAINER_PORT% i zmiennymi środowiskowymi...
docker run -d --name %CONTAINER% -p %HOST_PORT%:%CONTAINER_PORT% --restart unless-stopped -e PROXY_DOWNLOAD_ENABLED=true -e USE_API_V2=true %IMAGE%
if errorlevel 1 (
  echo Wystąpił błąd podczas uruchamiania kontenera.
  exit /b 2
)

echo.
echo Gotowe. Kontener "%CONTAINER%" powinien działać.
echo Sprawdź logi: docker logs -f %CONTAINER%
exit /b 0

:usage
echo Użycie: deploy.cmd [HostPort] [ContainerPort]
echo Przykłady:
echo   deploy.cmd           - użyj domyślnych portów 5000:5000
echo   deploy.cmd 8080 5000 - przypisz host:container 8080:5000
exit /b 0
