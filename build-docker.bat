@echo off
setlocal

rem Сборка docker-образа frontend. Версия берётся из package.json.
rem Использование:
rem   build-docker.bat [--no-cache] [user@host]
rem   SERVER=user@host build-docker.bat
rem   ARCHIVE_DIR=D:\docker build-docker.bat

set BUILD_OPTS=
if /i "%~1"=="--no-cache" set BUILD_OPTS=--no-cache --pull
if /i "%~1"=="no-cache" set BUILD_OPTS=--no-cache --pull

rem Куда сохранять архив образа
if not defined ARCHIVE_DIR set ARCHIVE_DIR=D:\docker
rem Сервер для scp-загрузки (user@host); можно задать переменной SERVER или вторым аргументом
if not defined SERVER set SERVER=%~2

for /f "usebackq delims=" %%v in (`powershell -NoProfile -Command "(Get-Content -Raw 'package.json' | ConvertFrom-Json).version"`) do set APP_VERSION=%%v
if not defined APP_VERSION (
    echo Failed to read version from package.json
    exit /b 1
)

echo Building image kopirovalnya-frontend:%APP_VERSION% %BUILD_OPTS% ...
docker build %BUILD_OPTS% -t kopirovalnya-frontend:%APP_VERSION% -t kopirovalnya-frontend:latest .
if errorlevel 1 (
    echo Build failed
    exit /b 1
)

if not exist "%ARCHIVE_DIR%" mkdir "%ARCHIVE_DIR%"
set TARFILE=%TEMP%\kopirovalnya-frontend_%APP_VERSION%.tar
set ARCHIVE=%ARCHIVE_DIR%\kopirovalnya-frontend_%APP_VERSION%.tar.gz
echo Saving image to %ARCHIVE% ...
docker save -o "%TARFILE%" kopirovalnya-frontend:%APP_VERSION%
if errorlevel 1 (
    echo docker save failed
    exit /b 1
)
powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; $fs=[IO.File]::OpenRead('%TARFILE%'); $gs=New-Object IO.Compression.GzipStream([IO.File]::Create('%ARCHIVE%'),[IO.Compression.CompressionMode]::Compress); $fs.CopyTo($gs); $gs.Close(); $fs.Close()"
if errorlevel 1 (
    echo gzip compression failed
    del "%TARFILE%"
    exit /b 1
)
del "%TARFILE%"

if defined SERVER (
    echo Uploading %ARCHIVE% to %SERVER%:~/docker ...
    scp "%ARCHIVE%" %SERVER%:~/docker/
    if errorlevel 1 (
        echo scp upload failed
        exit /b 1
    )
) else (
    echo SERVER not set - upload skipped. Set SERVER=user@host or pass it as 2nd argument.
)

echo Done: kopirovalnya-frontend:%APP_VERSION% and kopirovalnya-frontend:latest, archive %ARCHIVE%
endlocal
