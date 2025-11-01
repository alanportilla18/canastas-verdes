# Canastas Verdes 🌱# Sabores Pasto 🍽️This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



Plataforma web para la comercialización de productos agrícolas frescos directamente desde las fincas de Pasto, Colombia.



## 🚀 Inicio RápidoPlataforma web para la gestión y pedido de comida de restaurantes en Pasto, Colombia.## Getting Started



### Opción 1: Script Automático (Recomendado)



Si tienes Docker instalado:## 🚀 Inicio RápidoFirst, run the development server:



```powershell

.\start.ps1

```### Opción 1: Script Automático (Recomendado)```bash



Este script:npm run dev

- Inicia PostgreSQL automáticamente con Docker

- Aplica las migraciones de base de datosSi tienes Docker instalado:# or

- Inicia el servidor de desarrollo

yarn dev

### Opción 2: Configuración Manual

```powershell# or

1. **Instalar dependencias**:

```powershell.\start.ps1pnpm dev

npm install

`````````



2. **Configurar PostgreSQL**: Consulta [SETUP.md](./SETUP.md) para instrucciones detalladas



3. **Aplicar migraciones**:Este script:Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```powershell

npx prisma migrate deploy- Inicia PostgreSQL automáticamente con Docker

```

- Aplica las migraciones de base de datosYou can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

4. **Iniciar el servidor**:

```powershell- Inicia el servidor de desarrollo

npm run dev

```[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.



Abre [http://localhost:3000](http://localhost:3000) en tu navegador.### Opción 2: Configuración Manual



## 📋 Requisitos PreviosThe `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.



- Node.js 16+ ([Descargar](https://nodejs.org/))1. **Instalar dependencias**:

- PostgreSQL 12+ ([Descargar](https://www.postgresql.org/download/)) o Docker

```powershellThis project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## 🛠️ Tecnologías

npm install

- **Framework**: Next.js 13

- **Lenguaje**: TypeScript```## Learn More

- **Base de datos**: PostgreSQL

- **ORM**: Prisma

- **Estilos**: Tailwind CSS

- **Autenticación**: JWT (JSON Web Tokens)2. **Configurar PostgreSQL**: Consulta [SETUP.md](./SETUP.md) para instrucciones detalladasTo learn more about Next.js, take a look at the following resources:

- **Gestión de estado**: React Context + SWR



## 📁 Estructura del Proyecto

3. **Aplicar migraciones**:- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

```

canastasverdes/```powershell- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

├── components/      # Componentes React reutilizables

│   ├── modals/     # Componentes de modalesnpx prisma migrate deploy

│   └── restaurants/# Componentes de fincas y productos

├── context/        # Contextos de React (estado global)```You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

├── hooks/          # Hooks personalizados para autenticación y permisos

├── lib/            # Utilidades y configuración

├── pages/          # Páginas de Next.js y rutas API

│   └── api/        # Endpoints de la API4. **Iniciar el servidor**:## Deploy on Vercel

├── prisma/         # Schema y migraciones de base de datos

├── public/         # Archivos estáticos```powershell

├── styles/         # Estilos CSS globales

└── types/          # Definiciones de TypeScriptnpm run devThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

```

```

## ✨ Funcionalidades

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Para Clientes

- 🔍 Explorar fincas y sus productos agrícolasAbre [http://localhost:3000](http://localhost:3000) en tu navegador.

- 🛒 Carrito de compras

- 📦 Realizar y rastrear pedidos## 📋 Requisitos Previos

- ⭐ Dejar reseñas de fincas y productos

- ❤️ Marcar fincas y productos como favoritos- Node.js 16+ ([Descargar](https://nodejs.org/))

- 👤 Gestionar cuenta personal- PostgreSQL 12+ ([Descargar](https://www.postgresql.org/download/)) o Docker



### Para Administradores de Fincas## 🛠️ Tecnologías

- 🏡 Crear y gestionar finca

- 🥬 CRUD completo de productos agrícolas- **Framework**: Next.js 13

- 🏷️ Organizar productos por categorías- **Lenguaje**: TypeScript

- 📊 Ver y gestionar pedidos- **Base de datos**: PostgreSQL

- 📝 Responder a reseñas- **ORM**: Prisma

- **Estilos**: Tailwind CSS

## 🔧 Scripts Disponibles- **Autenticación**: JWT (JSON Web Tokens)

- **Gestión de estado**: React Context + SWR

```powershell

npm run dev      # Servidor de desarrollo## 📁 Estructura del Proyecto

npm run build    # Compilar para producción

npm start        # Iniciar en modo producción```

npm run lint     # Ejecutar lintersaborespasto/

```├── components/      # Componentes React reutilizables

│   ├── modals/     # Componentes de modales

### Scripts de Prisma│   └── restaurants/# Componentes específicos de restaurantes

├── context/        # Contextos de React (estado global)

```powershell├── hooks/          # Hooks personalizados para autenticación y permisos

npx prisma studio        # Interfaz gráfica para la base de datos├── lib/            # Utilidades y configuración

npx prisma migrate dev   # Crear nueva migración├── pages/          # Páginas de Next.js y rutas API

npx prisma generate      # Regenerar cliente de Prisma│   └── api/        # Endpoints de la API

```├── prisma/         # Schema y migraciones de base de datos

├── public/         # Archivos estáticos

## 🔑 Variables de Entorno├── styles/         # Estilos CSS globales

└── types/          # Definiciones de TypeScript

Consulta `.env.example` para ver todas las variables requeridas:```



- `DATABASE_URL`: URL de conexión a PostgreSQL## ✨ Funcionalidades

- `ACCESS_TOKEN_SECRET`: Secreto para tokens de acceso

- `REFRESH_TOKEN_SECRET`: Secreto para tokens de refresco### Para Clientes

- `ACCESS_TOKEN_EXPIRES_IN`: Tiempo de expiración del token de acceso (segundos)- 🔍 Explorar fincas y sus productos agrícolas

- `REFRESH_TOKEN_EXPIRES_IN`: Tiempo de expiración del token de refresco (segundos)- 🛒 Carrito de compras

- 📦 Realizar y rastrear pedidos

## 📚 Documentación Adicional- ⭐ Dejar reseñas de fincas y productos

- ❤️ Marcar fincas y productos como favoritos

- [SETUP.md](./SETUP.md) - Guía completa de configuración y solución de problemas- 👤 Gestionar cuenta personal

- [Documentación de Next.js](https://nextjs.org/docs)

- [Documentación de Prisma](https://www.prisma.io/docs/)### Para Administradores de Fincas

- � Crear y gestionar finca

## 🐳 Docker- 🥬 CRUD completo de productos agrícolas

- 🏷️ Organizar productos por categorías

Para iniciar PostgreSQL con Docker:- 📊 Ver y gestionar pedidos

- 📝 Responder a reseñas

```powershell

docker-compose up -d## 🔧 Scripts Disponibles

```

```powershell

Para detenerlo:npm run dev      # Servidor de desarrollo

npm run build    # Compilar para producción

```powershellnpm start        # Iniciar en modo producción

docker-compose downnpm run lint     # Ejecutar linter

``````



## 🤝 Flujo de Trabajo Básico### Scripts de Prisma



1. **Primera vez**:```powershell

   - Ejecuta `.\setup.ps1` para configurar todonpx prisma studio        # Interfaz gráfica para la base de datos

   - Crea una cuenta de administrador en `/crear-cuenta/administrador`npx prisma migrate dev   # Crear nueva migración

   - Crea tu finca en `/crear-restaurante`npx prisma generate      # Regenerar cliente de Prisma

```

2. **Desarrollo diario**:

   - Ejecuta `.\start.ps1` para iniciar todo automáticamente## 🔑 Variables de Entorno

   - O ejecuta `npm run dev` si PostgreSQL ya está corriendo

Consulta `.env.example` para ver todas las variables requeridas:

## 📝 Notas

- `DATABASE_URL`: URL de conexión a PostgreSQL

- Las dependencias tienen algunas vulnerabilidades conocidas. Ejecuta `npm audit` para más detalles.- `ACCESS_TOKEN_SECRET`: Secreto para tokens de acceso

- Prisma tiene actualizaciones disponibles. Para actualizar:- `REFRESH_TOKEN_SECRET`: Secreto para tokens de refresco

  ```powershell- `ACCESS_TOKEN_EXPIRES_IN`: Tiempo de expiración del token de acceso (segundos)

  npm i --save-dev prisma@latest- `REFRESH_TOKEN_EXPIRES_IN`: Tiempo de expiración del token de refresco (segundos)

  npm i @prisma/client@latest

  ```## 📚 Documentación Adicional



## 📄 Licencia- [SETUP.md](./SETUP.md) - Guía completa de configuración y solución de problemas

- [Documentación de Next.js](https://nextjs.org/docs)

Este proyecto es privado.- [Documentación de Prisma](https://www.prisma.io/docs/)



---## 🐳 Docker



Desarrollado con ❤️ para los agricultores de Pasto, ColombiaPara iniciar PostgreSQL con Docker:


```powershell
docker-compose up -d
```

Para detenerlo:

```powershell
docker-compose down
```

## 🤝 Flujo de Trabajo Básico

1. **Primera vez**:
   - Ejecuta `.\setup.ps1` para configurar todo
   - Crea una cuenta de administrador en `/crear-cuenta/administrador`
   - Crea tu restaurante en `/crear-restaurante`

2. **Desarrollo diario**:
   - Ejecuta `.\start.ps1` para iniciar todo automáticamente
   - O ejecuta `npm run dev` si PostgreSQL ya está corriendo

## 📝 Notas

- Las dependencias tienen algunas vulnerabilidades conocidas. Ejecuta `npm audit` para más detalles.
- Prisma tiene actualizaciones disponibles. Para actualizar:
  ```powershell
  npm i --save-dev prisma@latest
  npm i @prisma/client@latest
  ```

## 📄 Licencia

Este proyecto es privado.

---

Desarrollado con ❤️ para Pasto, Colombia
