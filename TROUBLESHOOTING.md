# 🔧 Solución de Problemas - Sabores Pasto

## PostgreSQL

### Error: "Can't reach database server at `localhost:5432`"

**Causa**: PostgreSQL no está ejecutándose.

**Soluciones**:

#### Si usas Docker:
```powershell
# Iniciar el contenedor
docker-compose up -d

# Verificar que está corriendo
docker ps | findstr postgres

# Ver logs si hay problemas
docker logs saborespasto-postgres
```

#### Si usas instalación local:
```powershell
# Ver estado del servicio
Get-Service postgresql*

# Iniciar el servicio
Start-Service postgresql-x64-15  # Ajusta el nombre según tu versión

# Verificar que el puerto está abierto
Test-NetConnection localhost -Port 5432
```

---

### Error: "password authentication failed for user 'postgres'"

**Causa**: La contraseña en el archivo `.env` no coincide con la de PostgreSQL.

**Solución**:

1. Verifica el archivo `.env`:
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/saborespasto?schema=public"
```

2. Si olvidaste la contraseña:
   - **Docker**: La contraseña predeterminada es `postgres`
   - **Local**: Consulta [POSTGRES_SETUP.md](./POSTGRES_SETUP.md) para resetearla

---

### Error: "database 'saborespasto' does not exist"

**Causa**: La base de datos no fue creada.

**Solución**:

#### Con Docker:
```powershell
# Conectarse al contenedor
docker exec -it saborespasto-postgres psql -U postgres

# Crear la base de datos
CREATE DATABASE saborespasto;

# Salir
\q
```

#### Con instalación local:
```powershell
# Conectarse con psql
psql -U postgres

# Crear la base de datos
CREATE DATABASE saborespasto;

# Salir
\q
```

---

## Prisma

### Error: "Environment variable not found: DATABASE_URL"

**Causa**: El archivo `.env` no existe o no está siendo leído.

**Solución**:

1. Verifica que existe el archivo `.env` en la raíz del proyecto
2. Copia desde `.env.example` si es necesario:
```powershell
Copy-Item .env.example .env
```
3. Edita `.env` con los valores correctos

---

### Error al ejecutar migraciones

**Causa**: Base de datos no accesible o migraciones corruptas.

**Solución**:

1. Verifica la conexión:
```powershell
npx prisma db pull
```

2. Verifica el estado de migraciones:
```powershell
npx prisma migrate status
```

3. Si hay problemas, resetea la base de datos (⚠️ BORRA TODOS LOS DATOS):
```powershell
npx prisma migrate reset
```

4. O aplica las migraciones manualmente:
```powershell
npx prisma migrate deploy
```

---

### Error: "@prisma/client did not initialize yet"

**Causa**: El cliente de Prisma no fue generado.

**Solución**:
```powershell
npx prisma generate
```

---

## Next.js

### Error: "Module not found" o errores de importación

**Causa**: Dependencias no instaladas o caché corrupto.

**Solución**:

1. Reinstalar dependencias:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

2. Limpiar caché de Next.js:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

### Error de compilación de TypeScript

**Causa**: Tipos no actualizados o errores de sintaxis.

**Solución**:

1. Regenerar tipos de Prisma:
```powershell
npx prisma generate
```

2. Ver errores específicos:
```powershell
npm run build
```

3. Verificar errores en VS Code o ejecutar:
```powershell
npx tsc --noEmit
```

---

### Puerto 3000 ya en uso

**Causa**: Otro proceso está usando el puerto 3000.

**Solución**:

1. Encontrar el proceso:
```powershell
netstat -ano | findstr :3000
```

2. Terminar el proceso (reemplaza [PID] con el ID del proceso):
```powershell
taskkill /PID [PID] /F
```

3. O usa otro puerto:
```powershell
$env:PORT=3001; npm run dev
```

---

## Node.js / npm

### Versión de Node.js incompatible

**Causa**: Estás usando una versión muy antigua de Node.js.

**Solución**:

1. Verifica tu versión:
```powershell
node --version
```

2. Debe ser 16.x o superior. Actualiza desde: https://nodejs.org/

---

### Errores con bcrypt en Windows

**Causa**: bcrypt requiere herramientas de compilación en Windows.

**Solución**:

1. Instala las herramientas de compilación:
```powershell
npm install --global windows-build-tools
```

2. O reinstala bcrypt:
```powershell
npm uninstall bcrypt
npm install bcrypt
```

---

## Docker

### Docker no está instalado

**Solución**:

1. Descarga Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Instala y reinicia tu computadora
3. Verifica la instalación:
```powershell
docker --version
docker-compose --version
```

---

### Error: "docker daemon not running"

**Causa**: Docker Desktop no está iniciado.

**Solución**:

1. Inicia Docker Desktop desde el menú Inicio
2. Espera a que el ícono en la bandeja del sistema indique que está listo
3. Intenta nuevamente

---

### Contenedor no puede conectarse a la red

**Causa**: Configuración de red de Docker.

**Solución**:

1. Reinicia Docker Desktop
2. O reinicia el contenedor:
```powershell
docker-compose down
docker-compose up -d
```

---

## Variables de Entorno

### Las variables de entorno no se cargan

**Causa**: El archivo `.env` no está en la ubicación correcta o hay errores de sintaxis.

**Solución**:

1. Verifica que `.env` está en la raíz del proyecto (no en subcarpetas)
2. No uses espacios alrededor del `=`:
   - ✅ Correcto: `DATABASE_URL="..."`
   - ❌ Incorrecto: `DATABASE_URL = "..."`
3. No uses comillas simples en Windows, usa dobles:
   - ✅ Correcto: `DATABASE_URL="postgresql://..."`
   - ❌ Incorrecto: `DATABASE_URL='postgresql://...'`

---

## Autenticación / JWT

### Error: "jwt malformed" o "invalid token"

**Causa**: Tokens inválidos o secretos JWT incorrectos.

**Solución**:

1. Cierra sesión completamente
2. Limpia las cookies del navegador para localhost:3000
3. Verifica que los secretos estén configurados en `.env`:
```env
ACCESS_TOKEN_SECRET="tu_secreto_aqui"
REFRESH_TOKEN_SECRET="otro_secreto_diferente"
```

---

## Rendimiento

### La aplicación está muy lenta

**Posibles causas y soluciones**:

1. **Modo desarrollo**: Es normal que sea más lento. Para producción:
```powershell
npm run build
npm start
```

2. **Base de datos sin índices**: Verifica que las migraciones se aplicaron correctamente

3. **Demasiados datos en desarrollo**: Usa `npx prisma studio` para limpiar datos de prueba

---

## Comandos de Diagnóstico

### Verificación completa del sistema

```powershell
# 1. Node.js
node --version
npm --version

# 2. PostgreSQL
Test-NetConnection localhost -Port 5432

# 3. Docker (si aplica)
docker --version
docker ps

# 4. Base de datos
npx prisma db pull

# 5. Estado de migraciones
npx prisma migrate status

# 6. Compilación
npm run build
```

---

## Comandos de Limpieza

### Reset completo (⚠️ BORRA TODOS LOS DATOS)

```powershell
# 1. Parar el servidor (Ctrl+C en la terminal donde corre)

# 2. Limpiar Node.js
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item package-lock.json

# 3. Reinstalar dependencias
npm install

# 4. Regenerar Prisma
npx prisma generate

# 5. Resetear base de datos
npx prisma migrate reset

# 6. Iniciar de nuevo
npm run dev
```

---

## Logs y Debugging

### Ver logs detallados de Next.js

```powershell
$env:DEBUG="*"; npm run dev
```

### Ver logs de PostgreSQL (Docker)

```powershell
docker logs -f saborespasto-postgres
```

### Ver logs de PostgreSQL (Local)

```powershell
Get-Content "C:\Program Files\PostgreSQL\15\data\log\*.log" -Tail 50 -Wait
```

---

## Preguntas Frecuentes

### ¿Cómo cierro el servidor?

Presiona `Ctrl+C` en la terminal donde está corriendo `npm run dev`

### ¿Cómo cambio el puerto del servidor?

```powershell
$env:PORT=3001; npm run dev
```

### ¿Cómo accedo desde otro dispositivo en mi red?

1. Encuentra tu IP local:
```powershell
ipconfig | findstr IPv4
```

2. Inicia el servidor en todas las interfaces:
```powershell
npm run dev -- -H 0.0.0.0
```

3. Accede desde otro dispositivo usando: `http://TU_IP:3000`

### ¿Cómo agrego datos de prueba?

Usa Prisma Studio:
```powershell
npx prisma studio
```

Se abrirá en http://localhost:5555 donde puedes agregar/editar datos visualmente.

---

## 🆘 Ayuda Adicional

Si ninguna de estas soluciones funciona:

1. 📘 Revisa la documentación completa en [SETUP.md](./SETUP.md)
2. 🔍 Busca el error exacto en GitHub Issues del repositorio
3. 📝 Copia el mensaje de error completo para buscar ayuda
4. 🧹 Intenta el reset completo (ver sección anterior)

---

## Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Docs](https://docs.docker.com/)
