# 🚀 Guía Rápida de Inicio - Canastas Verdes

## ✅ Estado Actual

✔️ Dependencias instaladas  
✔️ Cliente de Prisma generado  
✔️ Archivos de configuración creados  
❓ PostgreSQL necesita ser configurado  
❓ Migraciones pendientes de aplicar  

## 🎯 Próximos Pasos

### Opción 1: Usando Docker (MÁS FÁCIL) 🐳

```powershell
# 1. Iniciar PostgreSQL con Docker
docker-compose up -d

# 2. Ejecutar el script de inicio
.\start.ps1
```

¡Listo! La aplicación estará en http://localhost:3000

---

### Opción 2: Instalación Manual de PostgreSQL

#### Paso 1: Instalar PostgreSQL
- Descarga desde: https://www.postgresql.org/download/windows/
- Sigue las instrucciones en [POSTGRES_SETUP.md](./POSTGRES_SETUP.md)
- **IMPORTANTE**: Anota la contraseña que configures

#### Paso 2: Crear la Base de Datos
```sql
-- Usando pgAdmin o psql:
CREATE DATABASE saborespasto;
```

#### Paso 3: Actualizar .env
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/saborespasto?schema=public"
```

#### Paso 4: Aplicar Migraciones
```powershell
npx prisma migrate deploy
```

#### Paso 5: Iniciar el Servidor
```powershell
npm run dev
```

---

## 📋 Verificación Rápida

### Verificar que todo funciona:

```powershell
# 1. PostgreSQL está ejecutándose
Test-NetConnection localhost -Port 5432

# 2. Base de datos es accesible
npx prisma db pull

# 3. Servidor funciona
npm run dev
```

---

## 🛠️ Comandos Útiles

### PostgreSQL con Docker

```powershell
# Iniciar
docker-compose up -d

# Detener
docker-compose down

# Ver logs
docker logs saborespasto-postgres

# Entrar al contenedor
docker exec -it saborespasto-postgres psql -U postgres -d saborespasto
```

### Prisma

```powershell
# Ver base de datos gráficamente
npx prisma studio

# Generar cliente
npx prisma generate

# Aplicar migraciones
npx prisma migrate deploy

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Ver estado de migraciones
npx prisma migrate status
```

### Desarrollo

```powershell
# Modo desarrollo (con hot reload)
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start

# Linter
npm run lint
```

---

## 🎨 Primeros Pasos en la Aplicación

Una vez que el servidor esté corriendo (http://localhost:3000):

### 1. Crear Cuenta de Administrador
- Ve a: http://localhost:3000/crear-cuenta/administrador
- Completa el formulario de registro

### 2. Crear Restaurante
- Ve a: http://localhost:3000/crear-restaurante
- Configura tu restaurante (nombre, dirección, imagen, etc.)

### 3. Crear Categorías
- Ve a: http://localhost:3000/mi-restaurante/crear-categoria
- Crea categorías como "Entradas", "Platos Fuertes", "Bebidas", etc.

### 4. Crear Platos
- Ve a: http://localhost:3000/mi-restaurante/crear-plato
- Agrega platos con sus descripciones, precios e imágenes

### 5. Probar como Cliente
- Cierra sesión
- Crea una cuenta de usuario normal
- Explora restaurantes y realiza pedidos

---

## 🆘 Ayuda Rápida

### ¿No tienes Docker?
👉 Consulta [POSTGRES_SETUP.md](./POSTGRES_SETUP.md)

### ¿Problemas de configuración?
👉 Consulta [SETUP.md](./SETUP.md)

### ¿Error en la conexión a PostgreSQL?
```powershell
# Windows: Verificar servicio
Get-Service postgresql*

# Docker: Verificar contenedor
docker ps | findstr postgres
```

### ¿Errores de TypeScript?
```powershell
# Regenerar cliente de Prisma
npx prisma generate

# Limpiar y reinstalar
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📞 Estructura de URLs

- **Home**: http://localhost:3000
- **Crear cuenta admin**: http://localhost:3000/crear-cuenta/administrador
- **Crear cuenta usuario**: http://localhost:3000/crear-cuenta/usuario
- **Iniciar sesión**: http://localhost:3000/iniciar-sesion
- **Mi cuenta**: http://localhost:3000/mi-cuenta
- **Mi restaurante**: http://localhost:3000/mi-restaurante
- **Crear restaurante**: http://localhost:3000/crear-restaurante
- **Mis pedidos**: http://localhost:3000/mis-pedidos
- **Prisma Studio**: http://localhost:5555 (después de ejecutar `npx prisma studio`)

---

## 🎯 Estado de Configuración

Marca lo que ya completaste:

- [ ] PostgreSQL instalado y ejecutándose
- [ ] Base de datos `saborespasto` creada
- [ ] Archivo `.env` configurado correctamente
- [ ] Migraciones aplicadas (`npx prisma migrate deploy`)
- [ ] Servidor de desarrollo iniciado (`npm run dev`)
- [ ] Cuenta de administrador creada
- [ ] Restaurante creado
- [ ] Platos agregados

---

**¿Todo listo?** ¡Comienza a desarrollar! 🚀

¿Necesitas más ayuda? Revisa los archivos de documentación:
- 📘 [README.md](./README.md) - Visión general del proyecto
- 🔧 [SETUP.md](./SETUP.md) - Guía completa de configuración
- 🐘 [POSTGRES_SETUP.md](./POSTGRES_SETUP.md) - Instalación de PostgreSQL
