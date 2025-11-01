# Script de configuración para Canastas Verdes
# Ejecutar como: .\setup.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Configuración de Canastas Verdes" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js no está instalado" -ForegroundColor Red
    Write-Host "  Descárgalo desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Verificar PostgreSQL
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$pgRunning = Test-NetConnection localhost -Port 5432 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded

if ($pgRunning) {
    Write-Host "✓ PostgreSQL está ejecutándose en el puerto 5432" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL no está ejecutándose" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones para iniciar PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Si tienes PostgreSQL instalado, inicia el servicio:" -ForegroundColor Cyan
    Write-Host "   Get-Service postgresql* | Start-Service" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Si tienes Docker, ejecuta:" -ForegroundColor Cyan
    Write-Host "   docker run --name saborespasto-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=saborespasto -p 5432:5432 -d postgres:15" -ForegroundColor White
    Write-Host ""
    
    $continue = Read-Host "¿Quieres continuar de todas formas? (s/n)"
    if ($continue -ne "s") {
        exit 1
    }
}

Write-Host ""

# Verificar archivo .env
Write-Host "Verificando archivo .env..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ Archivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ Archivo .env no encontrado" -ForegroundColor Red
    Write-Host "  Se debería haber creado automáticamente" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Instalar dependencias
Write-Host "Instalando dependencias de Node.js..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Generar cliente de Prisma
Write-Host "Generando cliente de Prisma..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Cliente de Prisma generado" -ForegroundColor Green
} else {
    Write-Host "✗ Error al generar cliente de Prisma" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Aplicar migraciones (solo si PostgreSQL está ejecutándose)
if ($pgRunning) {
    Write-Host "Aplicando migraciones de base de datos..." -ForegroundColor Yellow
    npx prisma migrate deploy
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Migraciones aplicadas correctamente" -ForegroundColor Green
    } else {
        Write-Host "! Error al aplicar migraciones" -ForegroundColor Yellow
        Write-Host "  Verifica la configuración de DATABASE_URL en .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "⊘ Saltando migraciones (PostgreSQL no disponible)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Configuración completada" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar el servidor de desarrollo, ejecuta:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "La aplicación estará disponible en:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Consulta SETUP.md para más información" -ForegroundColor Cyan
Write-Host ""
