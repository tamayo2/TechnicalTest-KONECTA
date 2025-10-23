# �� KONECTA BANK — Prueba Técnica Full Stack

Aplicación completa para la **radicación y gestión de ventas de productos financieros**, desarrollada con **Node.js (Express + Prisma)** y **React (Vite + Redux Toolkit)**.

Incluye autenticación con JWT, **roles (Administrador / Asesor)**, validación con **reCAPTCHA**, **CRUD de usuarios y ventas**, **estadísticas de ventas**, y **despliegue con Docker**.

---

## �� Características principales

### �� Autenticación
- Login con email y contraseña (JWT + Refresh Token).
- Protección de rutas por rol.
- Integración con **Google reCAPTCHA v3** (validado desde backend).

### �� Usuarios (solo Admin)
- CRUD completo de usuarios.
- Campos: nombre, correo, contraseña (hash), tipo de usuario, fechas de creación y actualización.

### �� Ventas
- CRUD de productos radicados.
- Campos con reglas dinámicas:
    - Producto: Consumo, Libranza o Tarjeta de Crédito.
    - Muestra **Franquicia** (AMEX, VISA, MASTERCARD) solo si es tarjeta.
    - Muestra **Tasa** solo si es consumo o libranza.
- Calcula y muestra **sumatoria del cupo total**.
- Muestra **ventas propias o globales** según el rol.
- Incluye botón **"Ver"** y **formato de miles** en el cupo.

### �� Dashboard de estadísticas
- Widget de **Stats** con totales de ventas por tipo y montos agregados.

### ⚙️ Infraestructura
- Docker Compose con:
    - `PostgreSQL`
    - `API (Node.js)`
    - `Frontend (React)`
- Prisma ORM (migraciones automáticas y seeding).
- Validación centralizada con Zod.
- Manejo de errores con middleware + toast en frontend.

---

## �� Stack Tecnológico

| Área | Tecnologías |
|------|--------------|
| **Backend** | Node.js, Express, Prisma ORM, PostgreSQL, Zod, JWT, bcrypt, Helmet, Morgan |
| **Frontend** | React, TypeScript, Vite, Redux Toolkit (RTK Query), React Hook Form, Zod, Tailwind CSS |
| **Infraestructura** | Docker Compose, dotenv, pnpm |
| **Testing (opcional)** | Jest, Supertest |

---

## ⚙️ Variables de Entorno

Crea un archivo en la raíz llamado `.env.docker` con el siguiente contenido:

```dotenv
# === BACKEND ===
DATABASE_URL=postgresql://postgres:postgres@db:5432/konecta
JWT_SECRET=supersecret_jwt_key
JWT_EXPIRES_IN=15m
REFRESH_SECRET=another_secret
REFRESH_EXPIRES_IN=7d
CAPTCHA_PROVIDER=RECAPTCHA
CAPTCHA_SECRET=6LeSufQrAAAAANkZfF3lWJIwBNRW4ZCRjSnfyQlf
CAPTCHA_BYPASS=false
ORIGINS=http://localhost:5173

# === FRONTEND ===
VITE_API_URL=http://localhost:4000/api
VITE_RECAPTCHA_SITE_KEY=6LeSufQrAAAAAACecwnPZnffyy6YZ_pdFGnILrVi
```

---

## �� Despliegue con Docker

### 1️⃣ Construir e iniciar los servicios
```bash
docker compose up -d --build
```

### 2️⃣ Verificar contenedores
```bash
docker compose ps
```

Deberías ver algo como:
```
NAME              STATUS          PORTS
konecta-db        running         5432/tcp
konecta-api       running         0.0.0.0:4000->4000/tcp
konecta-web       running         0.0.0.0:5173->5173/tcp
```

### 3️⃣ Aplicar migraciones y seed
```bash
docker compose exec api pnpm prisma migrate deploy
docker compose exec api pnpm tsx prisma/seed.ts
```

---

## �� Uso del proyecto

### �� Login
Accede a:
```
http://localhost:5173/login
```
Usa un usuario del seed (por ejemplo):
```
Email: admin@bank.com
Contraseña: admin123
```

### �� Funcionalidades
- **Admin:** CRUD de usuarios y ventas (todas las ventas).
- **Asesor:** CRUD de sus propias ventas únicamente.
- **Ventas:** muestra productos radicados, suma total, y formulario dinámico.
- **Stats:** resumen con totales por tipo de producto.

---

## �� Comandos útiles

```bash
# Ver logs
docker compose logs -f api
docker compose logs -f web

# Reiniciar servicios
docker compose restart

# Parar contenedores
docker compose stop

# Eliminar contenedores y volúmenes
docker compose down -v

# Acceder al shell del backend
docker compose exec api sh
```

---

## �� Rutas principales

| Servicio | URL | Descripción |
|-----------|-----|--------------|
| Backend | `http://localhost:4000/api` | API principal |
| Frontend | `http://localhost:5173` | Interfaz web |
| DB (Postgres) | `localhost:5432` | Base de datos |
| Healthcheck | `http://localhost:4000/api/health` | Estado del backend |

---

## �� Plus implementados

✅ Validaciones avanzadas (Zod en front y back)  
✅ Manejo global de errores (middleware + toast)  
✅ reCAPTCHA validado desde backend  
✅ Roles Admin/Asesor con control de visibilidad  
✅ Dashboard de estadísticas  
✅ Docker Compose (API + Web + DB)  
✅ Prisma con seed automático  
✅ RTK Query para manejo centralizado de datos  
✅ Tipado completo con TypeScript

---

## ��‍�� Autor

**Juan Tamayo**  
📧 admin@bank.com  
💼 Proyecto técnico para **Konecta — Prueba Full Stack (Node + React)**  
🗓️ Octubre 2025
Contraer










