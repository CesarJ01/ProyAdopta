# 📦 AdoptaPro: Sistema de Registro y Login con Fastify, JWT y Prisma

## Descripción
Backend en **Node.js** que permite:
- Registrar usuarios en MySQL (XAMPP)
- Hacer login y generar JWT para autenticación
- Acceder a rutas protegidas usando el token
- Manejar passwords con **bcryptjs**
- Soportar body en **JSON** o `text/plain` para Postman

---

## Requisitos 
* **Node.js**: Versión `≥ 18`.
* **npm**: Se incluye con la instalación de Node.js.
* **XAMPP**: Necesario para el servidor web y la base de datos **MySQL**.

---

## Instalación

### 1. Clonación del Repositorio

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```
2.  **Instalar dependencias:**
    ```bash
    # Para backend
    cd adopcionback/
    npm install

    # Para frontend
    cd ../adopcionfront/
    npm install
    ```

### 2. Configurar variable de entorno
1.  Navega al directorio del backend (`adopcionback/`).

2.  Crea un archivo llamado **`.env`** y añade la siguiente configuración:

    ```env
    DATABASE_URL="mysql://root:@localhost:3306/adopta"
    JWT_SECRET="supersecreto"
    PORT=4000
    ```
    > **Nota:** Si tu usuario de MySQL usa una contraseña, modifica `root:@` a `usuario:contraseña@`.

### 3. Preparar el Entorno

Abre el Panel de Control de **XAMPP** e inicia los servicios:
* **Apache**
* **MySQL**

### 4. Inicializar la Base de Datos (Prisma Migración)

Usa Prisma para generar las tablas en la base de datos `adopta`.

```bash
cd adopcionback/ 
npx prisma migrate dev --name init_schema
```

---

## Ejecución

### 1. Ejecución del backend:

```bash
cd adopcionback/
node index.js
```

### 2. Ejecución del frontend:

```bash
cd adopcionfront/
npm run dev
```