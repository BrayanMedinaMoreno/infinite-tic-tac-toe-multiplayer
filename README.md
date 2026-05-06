# Tres en Raya Dinámico & Multijugador 🎮

Un juego de "Tres en Raya" moderno, infinito y multijugador en tiempo real. Esta aplicación Full-Stack permite a los usuarios jugar entre sí a través de WebSockets, enfrentarse a una Inteligencia Artificial, y competir en una tabla de clasificación global.

## Características Principales

- **Regla del Infinito (Cola Circular):** Los jugadores solo pueden tener un máximo de 3 fichas en el tablero. Al colocar la cuarta ficha, la primera ficha que colocaron desaparece, creando una dinámica de juego continua y estratégica.
- **Tablero Dinámico:** Los jugadores pueden elegir dinámicamente entre jugar en un tablero clásico de `3x3`, o expandir la estrategia a cuadrículas de `4x4` o `5x5`.
- **Multijugador en Tiempo Real:** Partidas sincronizadas instantáneamente entre jugadores reales utilizando WebSockets (Django Channels + Redis).
- **Modo Vs IA:** Un bot integrado para practicar en modo solitario en cualquier tamaño de tablero.
- **Sistema de Cuentas y Leaderboard:** Autenticación de usuarios mediante JWT. Las victorias y derrotas se guardan en la base de datos para alimentar una tabla de clasificación global (Leaderboard) en tiempo real.
- **Diseño Moderno:** Interfaz de usuario responsiva construida con Tailwind CSS, utilizando estética *Dark Mode* y *Glassmorphism*.

---

## Stack Tecnológico

### Frontend
- **Framework:** React + Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Gestión de Estado:** Zustand
- **WebSockets:** `react-use-websocket`
- **Rutas:** React Router DOM

### Backend
- **Framework:** Django + Django REST Framework (DRF)
- **WebSockets:** Django Channels
- **Lenguaje:** Python 3.x
- **Autenticación:** SimpleJWT (JSON Web Tokens)
- **Base de Datos:** PostgreSQL
- **Broker de Mensajería:** Redis (necesario para Channels)

### Infraestructura
- **Contenedores:** Docker y Docker Compose

---

## Cómo ejecutar el proyecto (Modo Desarrollo)

Este proyecto está completamente dockerizado. Solo necesitas tener **Docker Desktop** (o Docker y Docker Compose) instalados en tu sistema.

### 1. Clonar el repositorio
```bash
git clone <tu-url-del-repositorio>
cd "tres en raya"
```

### 2. Levantar los contenedores
Ejecuta el siguiente comando en la raíz del proyecto para construir y levantar todos los servicios (Base de datos, Redis, Backend y Frontend):

```bash
docker-compose up --build
```

> **Nota:** La primera vez que ejecutes este comando puede tardar un par de minutos mientras se descargan las imágenes de PostgreSQL, Redis, Python y Node.js.

### 3. Migraciones de Base de Datos
En otra terminal (con los contenedores corriendo), debes aplicar las migraciones a la base de datos de PostgreSQL:

```bash
docker-compose exec backend python manage.py migrate
```

### 4. ¡A jugar!
- **Frontend (Interfaz Gráfica):** Abre tu navegador en `http://localhost:5173`
- **Backend (API URL):** `http://localhost:8000/api/`

---

## Estructura del Proyecto

```text
/
├── backend/                  # Código fuente del servidor Django
│   ├── core/                 # Configuración principal (settings, asgi, urls)
│   ├── game/                 # App de Django para WebSockets y Modelos del juego
│   ├── users/                # App de Django para Registro, Login y Leaderboard
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile            # Configuración Docker del backend
├── frontend/                 # Código fuente de React
│   ├── src/                  
│   │   ├── components/       # Componentes visuales (Board, Leaderboard, etc.)
│   │   ├── pages/            # Páginas principales (GameRoom, Login, Register)
│   │   ├── store/            # Estado global (Zustand: authStore, gameStore)
│   │   ├── App.tsx           # Enrutamiento principal
│   │   └── index.css         # Directivas de Tailwind
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile            # Configuración Docker del frontend
├── docker-compose.yml        # Orquestación de contenedores (db, redis, backend, frontend)
└── README.md
```

##

