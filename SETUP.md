# Guía de Configuración - Canastas Verdes

Esta guía te ayudará a configurar y ejecutar el proyecto localmente.

## Requisitos Previos

1. **Node.js** (versión 16 o superior)
   - Descarga desde: https://nodejs.org/

2. **PostgreSQL** (versión 12 o superior)
   - Descarga desde: https://www.postgresql.org/download/

## Configuración Paso a Paso

### 1. Instalar PostgreSQL

#### Opción A: Instalación Local (Windows)
1. Descarga PostgreSQL desde https://www.postgresql.org/download/windows/
2. Ejecuta el instalador
3. Durante la instalación:
   - Anota la contraseña que configures para el usuario `postgres`
   - El puerto por defecto es `5432`
   - Marca la opción de instalar pgAdmin (herramienta gráfica)

#### Opción B: Usar Docker (Recomendado)
Si tienes Docker instalado, ejecuta:
```powershell
docker run --name saborespasto-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=saborespasto -p 5432:5432 -d postgres:15
```

### 2. Crear la Base de Datos

#### Si usaste instalación local:
1. Abre pgAdmin o la línea de comandos de PostgreSQL
2. Conéctate con el usuario `postgres`
3. Crea una nueva base de datos llamada `saborespasto`

```sql
CREATE DATABASE saborespasto;
```

#### Si usaste Docker:
La base de datos ya fue creada automáticamente.

### 3. Configurar Variables de Entorno

El archivo `.env` ya fue creado con valores predeterminados. Si necesitas ajustarlo:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/saborespasto?schema=public"
```

Reemplaza `TU_CONTRASEÑA` con la contraseña que configuraste.

### 4. Instalar Dependencias

Las dependencias ya fueron instaladas. Si necesitas reinstalarlas:

```powershell
npm install
```

### 5. Generar Cliente de Prisma

Ya generado. Para regenerar:

```powershell
npx prisma generate
```

### 6. Aplicar Migraciones

Una vez que PostgreSQL esté ejecutándose:

```powershell
npx prisma migrate dev
```

Este comando:
- Creará todas las tablas necesarias
- Aplicará todas las migraciones existentes
- Te pedirá un nombre si hay cambios pendientes (puedes presionar Enter para usar el nombre por defecto)

### 7. (Opcional) Sembrar Datos de Prueba

Si quieres agregar datos de ejemplo, puedes usar Prisma Studio:

```powershell
npx prisma studio
```

Esto abrirá una interfaz web donde puedes agregar datos manualmente.

### 8. Ejecutar el Servidor de Desarrollo

```powershell
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## Verificación de Servicios

### Verificar que PostgreSQL está ejecutándose:

```powershell
# En Windows, verificar el servicio
Get-Service -Name postgresql*

# O probar la conexión
Test-NetConnection localhost -Port 5432
```

### Si PostgreSQL no está ejecutándose:

```powershell
# Iniciar el servicio de PostgreSQL
Start-Service postgresql-x64-*  # El nombre puede variar
```

## Solución de Problemas Comunes

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté ejecutándose
- Verifica que el puerto 5432 no esté bloqueado por el firewall
- Revisa que la URL de conexión en `.env` sea correcta

### Error: "password authentication failed"
- Verifica que la contraseña en DATABASE_URL sea correcta
- Intenta resetear la contraseña del usuario postgres

### Error de compilación de TypeScript
```powershell
npm run build
```

### Limpiar y reinstalar dependencias
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)

## Estructura del Proyecto

```
saborespasto/
├── components/      # Componentes React reutilizables
├── context/        # Contextos de React para estado global
├── hooks/          # Hooks personalizados
├── lib/            # Utilidades y configuración
├── pages/          # Páginas de Next.js y rutas API
├── prisma/         # Schema y migraciones de base de datos
├── public/         # Archivos estáticos
├── styles/         # Estilos CSS globales
└── types/          # Definiciones de TypeScript
```

## Funcionalidades Principales

- **Autenticación**: Sistema de registro e inicio de sesión con JWT
- **Restaurantes**: CRUD completo de restaurantes
- **Platos**: Gestión de platos por restaurante
- **Pedidos**: Sistema de pedidos y carrito de compras
- **Reseñas**: Sistema de reseñas para restaurantes y platos
- **Favoritos**: Marcado de restaurantes y platos favoritos
- **Categorías**: Clasificación de platos por categorías

## Próximos Pasos

1. Crea una cuenta de administrador desde: http://localhost:3000/crear-cuenta/administrador
2. Crea un restaurante desde: http://localhost:3000/crear-restaurante
3. Agrega platos y categorías a tu restaurante
4. Prueba el flujo completo de pedidos

¡Tu aplicación ya está lista para usar! 🚀
