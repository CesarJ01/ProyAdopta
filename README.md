# 📦 Proyecto: Sistema de Registro y Login con Fastify, JWT y Prisma

## Descripción
Backend en **Node.js** que permite:
- Registrar usuarios en MySQL (XAMPP)
- Hacer login y generar JWT para autenticación
- Acceder a rutas protegidas usando el token
- Manejar passwords con **bcryptjs**
- Soportar body en **JSON** o `text/plain` para Postman

## Requisitos
- Node.js ≥ 18
- npm
- XAMPP con MySQL corriendo en `localhost:3306`
- Base de datos creada: `adopta`

## Instalación
1. Clonar el proyecto:
```bash
git clone <repo-o-carpeta>
cd adopcionback
Instalar dependencias:

bash
Copiar código
npm install
npm install bcryptjs @prisma/client @fastify/jwt
Inicializar Prisma:

bash
Copiar código
npx prisma init
Configurar .env:

env
Copiar código
DATABASE_URL="mysql://root:@localhost:3306/adopta"
JWT_SECRET="supersecreto"
PORT=4000
Crear migración y generar cliente Prisma:

bash
Copiar código
npx prisma migrate dev --name init
Estructura del proyecto
pgsql
Copiar código
adopcionback/
├─ prisma/
│   └─ schema.prisma
├─ node_modules/
├─ index.js
├─ prismaClient.js
├─ package.json
├─ package-lock.json
└─ .env


Ejecutar el servidor
node index.js


Servidor corriendo en http://localhost:4000

Logs visibles en consola
