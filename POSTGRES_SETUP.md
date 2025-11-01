# Instalación de PostgreSQL en Windows (Sin Docker)

Si prefieres instalar PostgreSQL directamente en Windows sin usar Docker, sigue estos pasos:

## 1. Descargar PostgreSQL

1. Ve a https://www.postgresql.org/download/windows/
2. Haz clic en "Download the installer"
3. Descarga la versión más reciente (15.x recomendado)

## 2. Instalar PostgreSQL

1. Ejecuta el instalador descargado
2. Durante la instalación:
   - **Directorio de instalación**: Deja el predeterminado
   - **Componentes**: Asegúrate de marcar:
     - ✅ PostgreSQL Server
     - ✅ pgAdmin 4 (interfaz gráfica)
     - ✅ Command Line Tools
   - **Directorio de datos**: Deja el predeterminado
   - **Contraseña**: **MUY IMPORTANTE** - Anota esta contraseña, la necesitarás para el `.env`
   - **Puerto**: Deja `5432`
   - **Locale**: Spanish, Colombia o Default locale

3. Completa la instalación

## 3. Verificar la Instalación

Abre PowerShell y ejecuta:

```powershell
# Verificar que el servicio está corriendo
Get-Service -Name postgresql*

# Debería mostrar algo como:
# Status   Name               DisplayName
# ------   ----               -----------
# Running  postgresql-x64-15  postgresql-x64-15 - PostgreSQL Server 15
```

Si el servicio no está corriendo, inícialo:

```powershell
Start-Service postgresql-x64-15
```

## 4. Crear la Base de Datos

### Opción A: Usando pgAdmin (Interfaz Gráfica)

1. Abre pgAdmin 4 desde el menú Inicio
2. Conéctate al servidor local (usa la contraseña que configuraste)
3. Haz clic derecho en "Databases" > "Create" > "Database..."
4. Nombre: `saborespasto`
5. Haz clic en "Save"

### Opción B: Usando psql (Línea de Comandos)

```powershell
# Navegar al directorio de PostgreSQL (ajusta la versión si es diferente)
cd "C:\Program Files\PostgreSQL\15\bin"

# Conectar a PostgreSQL
.\psql.exe -U postgres

# Dentro de psql, crear la base de datos:
CREATE DATABASE saborespasto;

# Verificar que se creó:
\l

# Salir:
\q
```

## 5. Actualizar el archivo .env

Edita el archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/saborespasto?schema=public"
```

Reemplaza `TU_CONTRASEÑA` con la contraseña que configuraste durante la instalación.

## 6. Probar la Conexión

Desde la raíz del proyecto, ejecuta:

```powershell
npx prisma db pull
```

Si ves un mensaje como "Introspecting based on datasource..." es que la conexión funciona correctamente.

## 7. Aplicar Migraciones

```powershell
npx prisma migrate deploy
```

Esto creará todas las tablas necesarias.

## 8. (Opcional) Verificar las Tablas

Puedes usar pgAdmin o psql para verificar que se crearon las tablas:

```sql
-- En psql:
\c saborespasto
\dt
```

Deberías ver tablas como: Account, Restaurant, Dish, Order, etc.

## Comandos Útiles de PostgreSQL

### Gestionar el Servicio

```powershell
# Ver estado
Get-Service postgresql*

# Iniciar
Start-Service postgresql-x64-15

# Detener
Stop-Service postgresql-x64-15

# Reiniciar
Restart-Service postgresql-x64-15
```

### Conectarse con psql

```powershell
# Desde cualquier ubicación (si está en el PATH)
psql -U postgres -d saborespasto

# O navega primero al directorio bin de PostgreSQL
cd "C:\Program Files\PostgreSQL\15\bin"
.\psql.exe -U postgres -d saborespasto
```

### Comandos dentro de psql

```sql
\l              -- Listar bases de datos
\c saborespasto -- Conectar a la base de datos saborespasto
\dt             -- Listar tablas
\d nombre_tabla -- Describir una tabla específica
\du             -- Listar usuarios
\q              -- Salir
```

## Solución de Problemas

### "psql no se reconoce como comando"

Agrega PostgreSQL al PATH:

1. Busca "Variables de entorno" en Windows
2. En "Variables del sistema", busca `Path` y haz clic en "Editar"
3. Agrega: `C:\Program Files\PostgreSQL\15\bin` (ajusta la versión)
4. Reinicia PowerShell

### "password authentication failed"

- Verifica que estés usando la contraseña correcta
- En caso de olvido, puedes resetearla:
  1. Localiza el archivo `pg_hba.conf` en `C:\Program Files\PostgreSQL\15\data\`
  2. Cambia `md5` a `trust` temporalmente
  3. Reinicia el servicio de PostgreSQL
  4. Cambia la contraseña con: `ALTER USER postgres PASSWORD 'nueva_contraseña';`
  5. Restaura `pg_hba.conf` a `md5`
  6. Reinicia el servicio nuevamente

### El servicio no inicia

```powershell
# Ver el log de errores
Get-Content "C:\Program Files\PostgreSQL\15\data\log\*.log" -Tail 50
```

### Puerto 5432 en uso

```powershell
# Ver qué proceso está usando el puerto
netstat -ano | findstr :5432

# Buscar información del proceso por PID
tasklist /FI "PID eq [PID_DEL_RESULTADO_ANTERIOR]"
```

## Recursos Adicionales

- [Documentación oficial de PostgreSQL](https://www.postgresql.org/docs/)
- [Tutorial de pgAdmin](https://www.pgadmin.org/docs/)
- [Guía de psql](https://www.postgresql.org/docs/current/app-psql.html)

---

Una vez completados estos pasos, continúa con el [SETUP.md](./SETUP.md) principal.
