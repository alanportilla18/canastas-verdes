# Script de inicio rápido
# Este script inicia PostgreSQL (con Docker) y el servidor de desarrollo

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Inicio Rápido - Canastas Verdes" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    $hasDocker = $true
    Write-Host "✓ Docker está instalado" -ForegroundColor Green
} catch {
    $hasDocker = $false
    Write-Host "⊘ Docker no está instalado" -ForegroundColor Yellow
}

Write-Host ""

# Si Docker está disponible, iniciar PostgreSQL
if ($hasDocker) {
    Write-Host "Iniciando PostgreSQL con Docker..." -ForegroundColor Yellow
    
    # Verificar si el contenedor ya existe
    $containerExists = docker ps -a --format "{{.Names}}" | Select-String -Pattern "saborespasto-postgres"
    
    if ($containerExists) {
        Write-Host "Contenedor existente encontrado, iniciando..." -ForegroundColor Cyan
        docker start saborespasto-postgres
    } else {
        Write-Host "Creando nuevo contenedor de PostgreSQL..." -ForegroundColor Cyan
        docker-compose up -d
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL iniciado correctamente" -ForegroundColor Green
        Write-Host "  Esperando 5 segundos para que la base de datos esté lista..." -ForegroundColor Cyan
        Start-Sleep -Seconds 5
    } else {
        Write-Host "✗ Error al iniciar PostgreSQL" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Verifica que PostgreSQL esté ejecutándose manualmente" -ForegroundColor Yellow
    $pgRunning = Test-NetConnection localhost -Port 5432 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
    
    if (!$pgRunning) {
        Write-Host "✗ PostgreSQL no está ejecutándose" -ForegroundColor Red
        Write-Host "  Consulta SETUP.md para instrucciones de instalación" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✓ PostgreSQL está ejecutándose" -ForegroundColor Green
}

Write-Host ""

# Aplicar migraciones si es necesario
Write-Host "Verificando estado de la base de datos..." -ForegroundColor Yellow
npx prisma migrate status 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "Aplicando migraciones..." -ForegroundColor Yellow
    npx prisma migrate deploy
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Migraciones aplicadas" -ForegroundColor Green
    } else {
        Write-Host "! Advertencia: No se pudieron aplicar todas las migraciones" -ForegroundColor Yellow
    }
}

Write-Host ""

# Iniciar servidor de desarrollo
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "La aplicación estará disponible en: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Cyan
Write-Host ""

npm run dev
