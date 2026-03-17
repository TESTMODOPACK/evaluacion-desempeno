# CLAUDE.md — Production App Development Guide
## Stack: Node.js · Express · Python · FastAPI · PostgreSQL · MySQL · MongoDB
## Deploy: VPS/Linux · cPanel/Shared Hosting

> Este archivo define los estándares, arquitecturas, patrones de resolución de problemas y
> documentación de instalación para todas las aplicaciones desarrolladas. **No hay versiones
> de prueba.** Todo código generado es production-ready desde el primer commit.

---

## 0. REGLAS ABSOLUTAS (leer antes de escribir una sola línea)

```
1. NUNCA usar credenciales hardcodeadas. Siempre variables de entorno (.env).
2. NUNCA devolver stack traces al cliente en producción. Siempre error handlers centralizados.
3. NUNCA confiar en input del usuario. Validar y sanitizar en la capa de entrada.
4. NUNCA usar versiones "latest" en dependencias. Siempre versión semántica exacta.
5. NUNCA omitir el manejo de errores async (try/catch o .catch()). Sin excepciones.
6. SIEMPRE generar README.md completo con instalación, configuración y troubleshooting.
7. SIEMPRE incluir .env.example con todas las variables requeridas (sin valores reales).
8. SIEMPRE incluir .gitignore apropiado para el stack antes del primer commit.
9. SIEMPRE documentar cada decisión arquitectónica no obvia con un comentario.
10. SIEMPRE que una app tenga base de datos, incluir script de migración inicial.
```

---

## 1. ESTRUCTURA DE PROYECTO

### 1.1 Node.js / Express — Full-Stack o API

```
/[nombre-app]/
├── .env                    ← Variables de entorno (NUNCA en git)
├── .env.example            ← Template de variables (SÍ en git)
├── .gitignore
├── .nvmrc                  ← Versión exacta de Node ("20.11.0")
├── package.json
├── package-lock.json       ← Siempre commitear el lockfile
├── README.md               ← Documentación completa (ver Sección 9)
│
├── src/
│   ├── app.js              ← Configuración de Express (sin listen)
│   ├── server.js           ← Entry point: listen + graceful shutdown
│   │
│   ├── config/
│   │   ├── database.js     ← Pool/conexión de BD
│   │   ├── env.js          ← Validación y exportación de variables de entorno
│   │   └── logger.js       ← Configuración de Winston/Pino
│   │
│   ├── routes/
│   │   ├── index.js        ← Router raíz: monta todos los sub-routers
│   │   ├── auth.routes.js
│   │   └── [recurso].routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── [recurso].controller.js
│   │
│   ├── services/           ← Lógica de negocio (sin HTTP awareness)
│   │   ├── auth.service.js
│   │   └── [recurso].service.js
│   │
│   ├── models/             ← Definiciones de BD / ODM
│   │   └── [recurso].model.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.js ← Error handler central
│   │   ├── notFound.js     ← 404 handler
│   │   ├── rateLimiter.js
│   │   └── validator.js    ← Wrapper de express-validator
│   │
│   ├── utils/
│   │   ├── AppError.js     ← Clase de error personalizada
│   │   ├── asyncHandler.js ← Wrapper para async route handlers
│   │   └── [util].js
│   │
│   └── migrations/         ← SQL migrations numeradas
│       ├── 001_initial_schema.sql
│       └── 002_[descripcion].sql
│
├── public/                 ← Archivos estáticos (si es full-stack)
│   ├── index.html
│   ├── assets/
│   └── ...
│
└── tests/
    ├── unit/
    └── integration/
```

### 1.2 Python / FastAPI

```
/[nombre-app]/
├── .env
├── .env.example
├── .gitignore
├── .python-version         ← Versión exacta ("3.11.8")
├── requirements.txt        ← Dependencias con versiones exactas
├── requirements-dev.txt    ← Solo dependencias de desarrollo
├── README.md
│
├── app/
│   ├── __init__.py
│   ├── main.py             ← Instancia FastAPI + monta routers + middleware
│   │
│   ├── core/
│   │   ├── config.py       ← Settings con Pydantic BaseSettings
│   │   ├── database.py     ← Engine SQLAlchemy / motor MongoDB
│   │   ├── security.py     ← JWT, hashing, tokens
│   │   └── logging.py      ← Configuración de loguru/structlog
│   │
│   ├── api/
│   │   ├── deps.py         ← Dependencias compartidas (get_db, get_current_user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py   ← Monta todos los sub-routers de v1
│   │       ├── auth.py
│   │       └── [recurso].py
│   │
│   ├── models/             ← SQLAlchemy ORM models
│   │   ├── base.py
│   │   └── [recurso].py
│   │
│   ├── schemas/            ← Pydantic schemas (request/response)
│   │   └── [recurso].py
│   │
│   ├── services/           ← Lógica de negocio
│   │   └── [recurso].py
│   │
│   └── utils/
│       └── [util].py
│
├── alembic/                ← Migraciones de BD
│   ├── env.py
│   └── versions/
│
├── alembic.ini
└── tests/
    ├── conftest.py
    ├── unit/
    └── integration/
```

---

## 2. CONFIGURACIÓN BASE: NODE.JS / EXPRESS

### 2.1 package.json de producción

```json
{
  "name": "[app-name]",
  "version": "1.0.0",
  "description": "[descripción]",
  "main": "src/server.js",
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "start":       "node src/server.js",
    "dev":         "nodemon src/server.js",
    "migrate":     "node src/migrations/run.js",
    "test":        "jest --coverage",
    "test:watch":  "jest --watch",
    "lint":        "eslint src/",
    "lint:fix":    "eslint src/ --fix"
  },
  "dependencies": {
    "express":              "4.18.3",
    "dotenv":               "16.4.5",
    "helmet":               "7.1.0",
    "cors":                 "2.8.5",
    "express-rate-limit":   "7.2.0",
    "express-validator":    "7.0.1",
    "bcryptjs":             "2.4.3",
    "jsonwebtoken":         "9.0.2",
    "winston":              "3.13.0",
    "morgan":               "1.10.0",
    "compression":          "1.7.4",
    "pg":                   "8.11.5",
    "mysql2":               "3.9.7",
    "mongoose":             "8.3.4",
    "joi":                  "17.13.1",
    "uuid":                 "9.0.1"
  },
  "devDependencies": {
    "nodemon":    "3.1.1",
    "jest":       "29.7.0",
    "supertest":  "7.0.0",
    "eslint":     "8.57.0"
  }
}
```

### 2.2 src/config/env.js — Validación de entorno en startup

```javascript
// src/config/env.js
// Valida que TODAS las variables requeridas existan antes de que la app arranque.
// Un error aquí en startup es mejor que un crash silencioso en producción.

require('dotenv').config();

const required = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  // Agregar aquí todas las variables obligatorias de esta app
];

const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error(`[ENV ERROR] Variables de entorno faltantes: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  env:        process.env.NODE_ENV || 'production',
  port:       parseInt(process.env.PORT, 10) || 3000,
  jwtSecret:  process.env.JWT_SECRET,
  jwtExpiry:  process.env.JWT_EXPIRY || '24h',

  db: {
    // PostgreSQL
    pg: {
      host:     process.env.PG_HOST,
      port:     parseInt(process.env.PG_PORT, 10) || 5432,
      database: process.env.PG_DATABASE,
      user:     process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      ssl:      process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
      // Pool settings para producción
      max:      parseInt(process.env.PG_POOL_MAX, 10) || 10,
      idleTimeoutMillis:    30000,
      connectionTimeoutMillis: 2000,
    },
    // MySQL
    mysql: {
      host:               process.env.MYSQL_HOST,
      port:               parseInt(process.env.MYSQL_PORT, 10) || 3306,
      database:           process.env.MYSQL_DATABASE,
      user:               process.env.MYSQL_USER,
      password:           process.env.MYSQL_PASSWORD,
      connectionLimit:    parseInt(process.env.MYSQL_POOL_SIZE, 10) || 10,
      waitForConnections: true,
      queueLimit:         0,
    },
    // MongoDB
    mongo: {
      uri:     process.env.MONGO_URI,
      options: {
        maxPoolSize:          10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS:      45000,
      },
    },
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : [],
    credentials: true,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max:      parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
};
```

### 2.3 src/app.js — Express configurado para producción

```javascript
// src/app.js
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const morgan     = require('morgan');
const compression = require('compression');
const rateLimit  = require('express-rate-limit');
const config     = require('./config/env');
const logger     = require('./config/logger');
const routes     = require('./routes');
const notFound   = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── SEGURIDAD ──
app.set('trust proxy', 1); // Requerido detrás de Nginx/cPanel proxy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false, // Desactivar si sirves assets externos
}));
app.use(cors(config.cors));

// ── RATE LIMITING ──
const limiter = rateLimit({
  windowMs:         config.rateLimit.windowMs,
  max:              config.rateLimit.max,
  standardHeaders:  true,
  legacyHeaders:    false,
  message: { status: 'error', message: 'Demasiadas peticiones. Intenta más tarde.' },
  skip: (req) => req.path === '/health', // Excluir health check
});
app.use('/api', limiter);

// ── PARSING ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// ── LOGGING ──
if (config.env !== 'test') {
  app.use(morgan('combined', {
    stream: { write: msg => logger.http(msg.trim()) },
    skip: (req) => req.path === '/health',
  }));
}

// ── HEALTH CHECK ── (requerido para monitoreo en VPS/cPanel)
app.get('/health', (req, res) => {
  res.status(200).json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
    version:   process.env.npm_package_version,
  });
});

// ── RUTAS ──
app.use('/api/v1', routes);

// ── ARCHIVOS ESTÁTICOS (si es full-stack) ──
// app.use(express.static(path.join(__dirname, '../public')));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

// ── ERROR HANDLERS (siempre al final) ──
app.use(notFound);
app.use(errorHandler);

module.exports = app;
```

### 2.4 src/server.js — Entry point con graceful shutdown

```javascript
// src/server.js
const app    = require('./app');
const config = require('./config/env');
const logger = require('./config/logger');
const db     = require('./config/database');

let server;

async function start() {
  try {
    // 1. Conectar bases de datos antes de aceptar requests
    await db.connect();
    logger.info('Base de datos conectada');

    // 2. Iniciar servidor
    server = app.listen(config.port, () => {
      logger.info(`Servidor iniciado en puerto ${config.port} [${config.env}]`);
    });

    // 3. Timeouts de producción
    server.keepAliveTimeout = 65000; // Mayor que el timeout de Nginx (60s)
    server.headersTimeout    = 66000;

  } catch (err) {
    logger.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
}

// ── GRACEFUL SHUTDOWN ──
// Crítico en producción: terminar requests activos antes de cerrar.
async function shutdown(signal) {
  logger.info(`${signal} recibido. Cerrando servidor gracefully...`);

  server.close(async () => {
    logger.info('HTTP server cerrado');
    try {
      await db.disconnect();
      logger.info('Conexiones de BD cerradas');
      process.exit(0);
    } catch (err) {
      logger.error('Error al cerrar BD:', err);
      process.exit(1);
    }
  });

  // Forzar cierre si tarda más de 30s
  setTimeout(() => {
    logger.error('Forzando cierre por timeout');
    process.exit(1);
  }, 30000);
}

process.on('SIGTERM', () => shutdown('SIGTERM')); // PM2 / systemd
process.on('SIGINT',  () => shutdown('SIGINT'));  // Ctrl+C
process.on('uncaughtException', (err) => {
  logger.error('Excepción no capturada:', err);
  shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  logger.error('Promise rechazada sin manejar:', reason);
  shutdown('unhandledRejection');
});

start();
```

### 2.5 Manejo de errores centralizado

```javascript
// src/utils/AppError.js
// Clase base para todos los errores operacionales de la aplicación.
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode  = statusCode;
    this.code        = code; // Ej: 'USER_NOT_FOUND', 'INVALID_TOKEN'
    this.isOperational = true; // Distingue errores de negocio vs bugs
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;

// ─────────────────────────────────────────────

// src/utils/asyncHandler.js
// Elimina el try/catch boilerplate en route handlers async.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
module.exports = asyncHandler;

// ─────────────────────────────────────────────

// src/middleware/errorHandler.js
const logger   = require('../config/logger');
const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  // Log siempre, incluyendo stack en desarrollo
  logger.error({
    message:    err.message,
    stack:      err.stack,
    statusCode: err.statusCode,
    path:       req.path,
    method:     req.method,
  });

  // Errores operacionales conocidos: devolver mensaje al cliente
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status:  'error',
      code:    err.code,
      message: err.message,
    });
  }

  // Errores de librerías: normalizar antes de exponer
  if (err.name === 'ValidationError') { // Mongoose
    return res.status(400).json({ status: 'error', message: 'Datos inválidos', details: err.errors });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ status: 'error', message: 'Token inválido' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ status: 'error', message: 'Token expirado' });
  }
  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ status: 'error', message: 'El recurso ya existe' });
  }
  if (err.code === 'ER_DUP_ENTRY') { // MySQL duplicate entry
    return res.status(409).json({ status: 'error', message: 'El recurso ya existe' });
  }

  // Errores desconocidos (bugs): NO exponer detalles al cliente
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    status:  'error',
    message: isProd ? 'Error interno del servidor' : err.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
};
```

---

## 3. CONFIGURACIÓN BASE: PYTHON / FASTAPI

### 3.1 app/core/config.py — Settings con Pydantic

```python
# app/core/config.py
from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # ── APP ──
    APP_NAME:     str = "App"
    APP_VERSION:  str = "1.0.0"
    ENVIRONMENT:  str = "production"
    DEBUG:        bool = False
    PORT:         int = 8000

    # ── SEGURIDAD ──
    SECRET_KEY:   str          # Sin default: forzar configuración explícita
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24h

    CORS_ORIGINS: List[str] = []

    @validator("CORS_ORIGINS", pre=True)
    def parse_cors(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # ── BASE DE DATOS ──
    # PostgreSQL
    PG_HOST:     Optional[str] = None
    PG_PORT:     int = 5432
    PG_DATABASE: Optional[str] = None
    PG_USER:     Optional[str] = None
    PG_PASSWORD: Optional[str] = None

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.PG_USER}:{self.PG_PASSWORD}"
            f"@{self.PG_HOST}:{self.PG_PORT}/{self.PG_DATABASE}"
        )

    # MySQL
    MYSQL_HOST:     Optional[str] = None
    MYSQL_PORT:     int = 3306
    MYSQL_DATABASE: Optional[str] = None
    MYSQL_USER:     Optional[str] = None
    MYSQL_PASSWORD: Optional[str] = None

    @property
    def MYSQL_URL(self) -> str:
        return (
            f"mysql+aiomysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        )

    # MongoDB
    MONGO_URI:      Optional[str] = None
    MONGO_DATABASE: Optional[str] = None

    # ── RATE LIMITING ──
    RATE_LIMIT_PER_MINUTE: int = 60


@lru_cache()  # Singleton: una sola instancia en toda la app
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

### 3.2 app/main.py — FastAPI configurado para producción

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.database import init_db, close_db
from app.core.logging import setup_logging
from app.api.v1.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestión del ciclo de vida: startup y shutdown."""
    setup_logging()
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    # Deshabilitar docs en producción es opcional; habilitarlos con auth es mejor
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url=None,
    openapi_url="/openapi.json" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

# ── MIDDLEWARE ──
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["*"],
)

# ── EXCEPTION HANDLERS ──
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Normaliza los errores de validación de Pydantic para el cliente."""
    errors = []
    for error in exc.errors():
        errors.append({
            "field":   " → ".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type":    error["type"],
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"status": "error", "message": "Datos inválidos", "details": errors},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all: nunca exponer traceback en producción."""
    import logging
    logging.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "Error interno del servidor"},
    )

# ── HEALTH CHECK ──
@app.get("/health", tags=["system"], include_in_schema=False)
async def health_check():
    return {"status": "ok", "version": settings.APP_VERSION}

# ── RUTAS ──
app.include_router(api_router, prefix="/api/v1")
```

---

## 4. BASES DE DATOS

### 4.1 PostgreSQL — Pool con pg (Node.js)

```javascript
// src/config/database.js (PostgreSQL)
const { Pool } = require('pg');
const config   = require('./env');
const logger   = require('./logger');

const pool = new Pool(config.db.pg);

pool.on('error', (err) => {
  logger.error('Error inesperado en cliente pg idle:', err);
});

// Helper: query con logging automático de duración
async function query(text, params) {
  const start  = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    logger.warn(`Query lenta (${duration}ms): ${text}`);
  }
  return result;
}

// Helper: transacciones
async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  query,
  withTransaction,
  connect:    () => pool.connect().then(c => { c.release(); return true; }),
  disconnect: () => pool.end(),
  pool,
};
```

### 4.2 MySQL — Pool con mysql2 (Node.js)

```javascript
// src/config/database.mysql.js
const mysql  = require('mysql2/promise');
const config = require('./env');
const logger = require('./logger');

const pool = mysql.createPool(config.db.mysql);

async function query(sql, params = []) {
  const start = Date.now();
  const [rows] = await pool.execute(sql, params);
  const duration = Date.now() - start;
  if (duration > 1000) logger.warn(`Query lenta (${duration}ms): ${sql}`);
  return rows;
}

async function withTransaction(callback) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  query,
  withTransaction,
  connect:    () => pool.getConnection().then(c => { c.release(); return true; }),
  disconnect: () => pool.end(),
};
```

### 4.3 MongoDB — Mongoose con reconexión automática (Node.js)

```javascript
// src/config/database.mongo.js
const mongoose = require('mongoose');
const config   = require('./env');
const logger   = require('./logger');

mongoose.set('strictQuery', true);
mongoose.set('debug', config.env === 'development');

async function connect() {
  await mongoose.connect(config.db.mongo.uri, config.db.mongo.options);
}

mongoose.connection.on('connected',    () => logger.info('MongoDB conectado'));
mongoose.connection.on('disconnected', () => logger.warn('MongoDB desconectado'));
mongoose.connection.on('error',        (err) => logger.error('MongoDB error:', err));

// Reconexión automática
mongoose.connection.on('disconnected', () => {
  setTimeout(connect, 5000);
});

module.exports = {
  connect,
  disconnect: () => mongoose.disconnect(),
};
```

### 4.4 Migración inicial — Patrón recomendado (PostgreSQL)

```sql
-- src/migrations/001_initial_schema.sql
-- Ejecutar con: psql -U user -d database -f migrations/001_initial_schema.sql

BEGIN;

-- Tabla de control de migraciones (siempre primero)
CREATE TABLE IF NOT EXISTS schema_migrations (
  id          SERIAL PRIMARY KEY,
  version     VARCHAR(50) NOT NULL UNIQUE,
  applied_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla de usuarios (base para cualquier app con auth)
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(255),
  role            VARCHAR(50) NOT NULL DEFAULT 'user',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  email_verified  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- Trigger: actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Registrar migración
INSERT INTO schema_migrations (version) VALUES ('001_initial_schema')
  ON CONFLICT (version) DO NOTHING;

COMMIT;
```

---

## 5. AUTENTICACIÓN JWT — PATRÓN COMPLETO

```javascript
// src/services/auth.service.js
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const config    = require('../config/env');
const db        = require('../config/database');
const AppError  = require('../utils/AppError');

const SALT_ROUNDS = 12; // No bajar de 10 en producción

async function register({ email, password, name }) {
  // 1. Verificar si ya existe
  const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (rows.length > 0) {
    throw new AppError('El email ya está registrado', 409, 'EMAIL_TAKEN');
  }

  // 2. Hashear password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Insertar usuario
  const { rows: [user] } = await db.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, email, name, role, created_at`,
    [email.toLowerCase(), passwordHash, name]
  );

  return { user, token: generateToken(user) };
}

async function login({ email, password }) {
  // 1. Buscar usuario
  const { rows } = await db.query(
    'SELECT id, email, name, role, password_hash, is_active FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  const user = rows[0];

  // Respuesta idéntica si no existe o password incorrecto (evita user enumeration)
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Credenciales incorrectas', 401, 'INVALID_CREDENTIALS');
  }
  if (!user.is_active) {
    throw new AppError('Cuenta desactivada', 403, 'ACCOUNT_DISABLED');
  }

  const { password_hash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token: generateToken(userWithoutPassword) };
}

function generateToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiry, issuer: 'app' }
  );
}

module.exports = { register, login };
```

```javascript
// src/middleware/auth.middleware.js
const jwt      = require('jsonwebtoken');
const config   = require('../config/env');
const AppError = require('../utils/AppError');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Token requerido', 401, 'NO_TOKEN'));
  }
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, config.jwtSecret, { issuer: 'app' });
    next();
  } catch (err) {
    next(err); // JsonWebTokenError y TokenExpiredError manejados en errorHandler
  }
}

// Middleware de autorización por rol
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Sin permisos para esta acción', 403, 'FORBIDDEN'));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
```

---

## 6. VARIABLES DE ENTORNO (.env.example)

```bash
# .env.example
# Copiar a .env y completar TODOS los valores antes de iniciar la app.
# NUNCA commitear el archivo .env real.

# ── APP ──
NODE_ENV=production          # development | production | test
PORT=3000
APP_NAME=mi-app

# ── SEGURIDAD ──
# Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=
JWT_EXPIRY=24h

# ── CORS ──
# Lista separada por comas. Ej: https://miapp.cl,https://www.miapp.cl
CORS_ORIGIN=

# ── RATE LIMITING ──
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos en ms
RATE_LIMIT_MAX=100

# ── POSTGRESQL ──
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=
PG_USER=
PG_PASSWORD=
PG_SSL=false
PG_POOL_MAX=10

# ── MYSQL ──
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_POOL_SIZE=10

# ── MONGODB ──
# Formato: mongodb://user:password@host:port/database
MONGO_URI=
MONGO_DATABASE=

# ── LOGGING ──
LOG_LEVEL=info               # error | warn | info | http | debug

# ── EMAIL (si aplica) ──
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@miapp.cl
```

---

## 7. DEPLOY EN PRODUCCIÓN

### 7.1 VPS / Linux — Con PM2 + Nginx

#### 7.1.1 Instalación del servidor

```bash
# ── 1. ACTUALIZAR SISTEMA ──
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw fail2ban

# ── 2. INSTALAR NODE.JS (vía nvm — no usar apt) ──
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20.11.0
nvm use 20.11.0
nvm alias default 20.11.0
node --version  # Verificar: v20.11.0

# ── 3. INSTALAR PM2 GLOBALMENTE ──
npm install -g pm2@5.3.1
pm2 startup systemd -u $USER --hp $HOME
# Ejecutar el comando que PM2 imprime (sudo env PATH=...)

# ── 4. INSTALAR PYTHON (si aplica) ──
sudo apt install -y python3.11 python3.11-venv python3.11-dev
sudo ln -sf /usr/bin/python3.11 /usr/local/bin/python3

# ── 5. CONFIGURAR FIREWALL ──
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status

# ── 6. INSTALAR CERTBOT (SSL) ──
sudo apt install -y certbot python3-certbot-nginx
```

#### 7.1.2 Deploy de la aplicación

```bash
# ── 1. CLONAR REPOSITORIO ──
cd /var/www
sudo mkdir [nombre-app]
sudo chown $USER:$USER [nombre-app]
git clone https://github.com/[usuario]/[repo].git [nombre-app]
cd [nombre-app]

# ── 2. CONFIGURAR VARIABLES DE ENTORNO ──
cp .env.example .env
nano .env  # Completar TODOS los valores

# ── 3. INSTALAR DEPENDENCIAS (producción: sin devDependencies) ──
npm ci --only=production

# ── 4. EJECUTAR MIGRACIONES ──
npm run migrate  # o psql / alembic según el proyecto

# ── 5. INICIAR CON PM2 ──
pm2 start ecosystem.config.js
pm2 save  # Persistir configuración para reinicios del servidor

# ── 6. VERIFICAR ──
pm2 status
pm2 logs [nombre-app] --lines 50
curl http://localhost:[PORT]/health
```

#### 7.1.3 ecosystem.config.js (PM2)

```javascript
// ecosystem.config.js
// Versionar este archivo. No incluye secretos.
module.exports = {
  apps: [{
    name:           '[nombre-app]',
    script:         'src/server.js',
    instances:      'max',        // Un proceso por CPU core
    exec_mode:      'cluster',    // Balanceo de carga interno
    watch:          false,        // NUNCA true en producción
    max_memory_restart: '500M',
    env_production: {
      NODE_ENV: 'production',
    },
    // Logs persistentes
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file:  './logs/pm2-error.log',
    out_file:    './logs/pm2-out.log',
    merge_logs:  true,
    // Reinicio automático en crashes
    autorestart:    true,
    max_restarts:   10,
    restart_delay:  4000,
  }],
};
```

#### 7.1.4 Nginx como reverse proxy

```nginx
# /etc/nginx/sites-available/[nombre-app]
# Enlazar con: sudo ln -s /etc/nginx/sites-available/[nombre-app] /etc/nginx/sites-enabled/

server {
    listen 80;
    server_name [dominio.cl] www.[dominio.cl];
    # Certbot agregará la redirección HTTPS aquí automáticamente
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name [dominio.cl] www.[dominio.cl];

    # Certbot gestionará estos certificados
    ssl_certificate     /etc/letsencrypt/live/[dominio.cl]/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/[dominio.cl]/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # ── HEADERS DE SEGURIDAD ──
    add_header X-Frame-Options           "SAMEORIGIN"              always;
    add_header X-Content-Type-Options    "nosniff"                 always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy        "camera=(), microphone=()" always;

    # ── LOGS ──
    access_log /var/log/nginx/[nombre-app]-access.log;
    error_log  /var/log/nginx/[nombre-app]-error.log;

    # ── ARCHIVOS ESTÁTICOS (si full-stack) ──
    location /assets/ {
        alias /var/www/[nombre-app]/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # ── PROXY A NODE/PYTHON ──
    location / {
        proxy_pass         http://127.0.0.1:[PORT];
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
        # Tamaño máximo de body
        client_max_body_size 10M;
    }
}
```

```bash
# Aplicar configuración Nginx
sudo nginx -t              # Verificar sintaxis
sudo systemctl reload nginx

# SSL con Certbot
sudo certbot --nginx -d [dominio.cl] -d www.[dominio.cl]

# Verificar renovación automática
sudo certbot renew --dry-run
```

---

### 7.2 cPanel / Shared Hosting — Node.js con Passenger

#### 7.2.1 Requisitos previos en cPanel

```
1. El hosting debe tener Node.js Selector habilitado (cPanel → Software → Node.js)
2. Verificar versión de Node disponible (preferir LTS: 20.x)
3. Acceso SSH habilitado para comandos de instalación
4. Puerto de la app gestionado por Passenger (no usar listen() directo en app.js)
```

#### 7.2.2 Estructura de archivos en cPanel

```
~/[dominio.cl]/         ← Document Root del dominio
├── public_html/        ← SOLO archivos estáticos aquí (Passenger los sirve)
│   └── (vacío o con assets estáticos)
│
└── [nombre-app]/       ← App Node.js FUERA del public_html
    ├── app.js          ← Entry point configurado en cPanel Node.js Selector
    ├── .env
    ├── .htaccess       ← Ver contenido abajo
    ├── package.json
    ├── package-lock.json
    └── src/
```

#### 7.2.3 app.js — Entry point adaptado para Passenger

```javascript
// app.js (entry point para cPanel/Passenger)
// IMPORTANTE: Passenger inyecta el listener, NO usar app.listen() directamente.
// Passenger pasa el puerto vía process.env.PORT automáticamente.

require('dotenv').config();

// Validar entorno antes de cualquier cosa
const required = ['NODE_ENV', 'JWT_SECRET'];
const missing  = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('[STARTUP ERROR] Variables faltantes:', missing.join(', '));
  process.exit(1);
}

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const compression  = require('compression');

const app = express();

app.set('trust proxy', 1); // Requerido detrás de Passenger/proxy de cPanel

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || [], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(compression());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Montar rutas
const routes = require('./src/routes');
app.use('/api/v1', routes);

// Error handlers (ver Sección 2.5)
app.use(require('./src/middleware/notFound'));
app.use(require('./src/middleware/errorHandler'));

// Passenger gestiona el listen() — exportar la app es suficiente
module.exports = app;
```

#### 7.2.4 .htaccess para routing en cPanel

```apache
# public_html/.htaccess
# Redirige todo al Passenger app entry point

Options -MultiViews
RewriteEngine On

# No redirigir archivos y directorios que existen físicamente
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Redirigir todo lo demás al app
RewriteRule ^(.*)$ app.js [L]
```

#### 7.2.5 Proceso de instalación en cPanel

```bash
# ── VÍA SSH ──

# 1. Navegar al directorio de la app
cd ~/[nombre-app]

# 2. Clonar o subir archivos vía Git/FTP
git clone https://github.com/[usuario]/[repo].git .

# 3. Instalar dependencias (Passenger usa npm ci)
npm ci --only=production

# 4. Configurar variables de entorno
cp .env.example .env
nano .env

# 5. Ejecutar migraciones si aplica
# Para cPanel con BD remota, configurar PG_HOST/MYSQL_HOST con el host del panel

# ── VÍA CPANEL UI ──
# Software → Node.js → Create Application:
#   Node.js version: 20.x (LTS)
#   Application mode: Production
#   Application root: /[nombre-app]
#   Application URL: [dominio.cl] o subdominio
#   Application startup file: app.js

# Hacer clic en "Run NPM Install" en la interfaz de cPanel
# Después de cambios en código: clic en "Restart" en Node.js Selector
```

#### 7.2.6 Problemas frecuentes en cPanel y soluciones

```
PROBLEMA: La app retorna HTML del cPanel en lugar de JSON de la API
CAUSA:    Passenger no está gestionando la ruta correctamente
SOLUCIÓN:
  1. Verificar que .htaccess existe en public_html con la config de arriba
  2. Verificar que el Application startup file sea exactamente "app.js"
  3. En Node.js Selector → Restart Application
  4. Revisar el error log: ~/logs/[app]-stderr.log

PROBLEMA: Variables de entorno no cargando
CAUSA:    .env no se carga automáticamente en Passenger
SOLUCIÓN:
  - Opción A: Agregar variables en cPanel → Node.js → Environment variables (UI)
  - Opción B: require('dotenv').config() debe ser la PRIMERA línea de app.js
  - Opción C: Si hay subpath (/api/app), verificar que dotenv lee la ruta absoluta:
    require('dotenv').config({ path: require('path').resolve(__dirname, '.env') })

PROBLEMA: npm ci falla con errores de permisos
CAUSA:    Restricciones del shared hosting
SOLUCIÓN:
  npm ci --only=production --prefix ~/[nombre-app]
  # O usar el botón "Run NPM Install" en cPanel UI que corre con permisos correctos

PROBLEMA: App se cae silenciosamente
CAUSA:    Error no capturado sin logs visibles
SOLUCIÓN:
  tail -f ~/logs/[app]-stderr.log
  # Agregar al app.js:
  process.on('uncaughtException', (err) => {
    const fs = require('fs');
    fs.appendFileSync('./logs/crash.log', `${new Date().toISOString()} ${err.stack}\n`);
    process.exit(1);
  });

PROBLEMA: Módulos nativos no compilan (bcrypt, sharp, etc.)
CAUSA:    Shared hosting sin build tools
SOLUCIÓN: Usar alternativas puras:
  bcrypt     → bcryptjs    (100% JS, misma API)
  sharp      → jimp        (100% JS)
  canvas     → No disponible en shared hosting

PROBLEMA: Timeout en requests largos
CAUSA:    Passenger tiene timeout de ~30s por defecto
SOLUCIÓN:
  # En .htaccess:
  PassengerMaxRequests 1000
  PassengerStatThrottleRate 1
  # Mover operaciones largas a jobs/queues o responder 202 Accepted + polling
```

---

## 8. RESOLUCIÓN DE PROBLEMAS COMUNES

### 8.1 Base de datos

```
PROBLEMA: Connection pool exhausted (PostgreSQL/MySQL)
SÍNTOMA:  "Error: timeout exceeded when trying to connect"
CAUSA:    Conexiones no liberadas correctamente (ej: client.release() no llamado)
SOLUCIÓN:
  1. Usar siempre el helper withTransaction() que hace release en finally
  2. Verificar con: SELECT count(*) FROM pg_stat_activity WHERE state = 'idle';
  3. Ajustar PG_POOL_MAX según carga esperada
  4. Implementar pool.on('error') para detectar conexiones zombies

PROBLEMA: Migraciones fuera de orden en equipo
SOLUCIÓN: Usar numeración timestamp en lugar de secuencial:
  20240315_001_add_users.sql  (YYYYMMDD_NNN_descripcion)

PROBLEMA: MongoDB ObjectId vs UUID en referencias
REGLA: Nunca mezclar. Si el proyecto usa MongoDB, todas las colecciones
       deben usar ObjectId. Definir claramente en el modelo base.
```

### 8.2 Node.js / Express

```
PROBLEMA: Memory leak en producción (heap creciendo indefinidamente)
DIAGNÓSTICO:
  node --inspect src/server.js
  # Conectar con Chrome DevTools → chrome://inspect → Memory → Heap snapshot
CAUSAS FRECUENTES:
  - Event listeners acumulándose (removeListener en cleanup)
  - Closures grandes en setInterval sin clearInterval
  - Cache sin límite de tamaño (usar lru-cache con maxSize)

PROBLEMA: CORS bloqueando requests
CHECKLIST:
  1. ¿El origin exacto está en CORS_ORIGIN? (con protocolo, sin trailing slash)
  2. ¿app.set('trust proxy', 1) está activado?
  3. ¿Las rutas de preflight (OPTIONS) están siendo manejadas?
  4. Verificar en Network DevTools: ¿el servidor devuelve Access-Control-Allow-Origin?

PROBLEMA: JWT inválido intermitente en clúster PM2
CAUSA:    Cada instancia del clúster debe usar el MISMO JWT_SECRET
SOLUCIÓN: Verificar que JWT_SECRET en .env es idéntico en todos los nodos
          pm2 env [app-id]  # Ver variables de entorno activas
```

### 8.3 Python / FastAPI

```
PROBLEMA: ImportError al iniciar en producción
CAUSA:    Dependencias instaladas en entorno virtual incorrecto
SOLUCIÓN:
  source venv/bin/activate
  pip install -r requirements.txt
  python -c "from app.main import app"  # Test de importación

PROBLEMA: Pydantic ValidationError en producción
CAUSA:    Campo requerido en Settings sin valor en .env
SOLUCIÓN:
  python -c "from app.core.config import settings; print(settings.dict())"
  # Verá el campo que falla antes de iniciar la app

PROBLEMA: Alembic "Target database is not up to date"
SOLUCIÓN:
  alembic current          # Ver estado actual
  alembic history          # Ver historial
  alembic upgrade head     # Aplicar todas las migraciones pendientes
```

---

## 9. DOCUMENTACIÓN OBLIGATORIA (README.md)

**Todo proyecto debe incluir un README.md con exactamente estas secciones.**

```markdown
# [Nombre del Proyecto]

[Descripción de 1-2 oraciones: qué hace, para quién, tecnología principal]

## Stack Tecnológico

- **Backend**: Node.js 20.x / Express 4.x  (o Python 3.11 / FastAPI 0.x)
- **Base de datos**: PostgreSQL 15 / MySQL 8 / MongoDB 7
- **Deploy**: VPS Ubuntu 22.04 / cPanel con Passenger
- **Process manager**: PM2 5.x (solo VPS)

---

## Requisitos Previos

| Herramienta  | Versión mínima | Verificar con          |
|--------------|----------------|------------------------|
| Node.js      | 20.0.0         | `node --version`       |
| npm          | 10.0.0         | `npm --version`        |
| PostgreSQL   | 15.0           | `psql --version`       |
| Git          | 2.x            | `git --version`        |

---

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/[usuario]/[repo].git
cd [repo]
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con los valores reales. Ver descripción de cada variable en
[Sección: Variables de Entorno](#variables-de-entorno).

**Variables obligatorias antes de continuar:**
- `JWT_SECRET` — Generar con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `PG_PASSWORD` / `MYSQL_PASSWORD` / `MONGO_URI` — Credenciales de tu BD local

### 3. Instalar dependencias

```bash
npm ci
```

### 4. Crear base de datos (PostgreSQL)

```bash
createdb [nombre-bd]
psql -U [usuario] -d [nombre-bd] -f src/migrations/001_initial_schema.sql
```

### 5. Iniciar en desarrollo

```bash
npm run dev
# Servidor disponible en: http://localhost:3000
# Health check: http://localhost:3000/health
```

---

## Variables de Entorno

| Variable          | Requerida | Descripción                                    | Ejemplo             |
|-------------------|-----------|------------------------------------------------|---------------------|
| `NODE_ENV`        | ✅        | Entorno de ejecución                           | `production`        |
| `PORT`            | ✅        | Puerto del servidor                            | `3000`              |
| `JWT_SECRET`      | ✅        | Clave para firmar tokens JWT (mín. 64 chars)   | `[hash aleatorio]`  |
| `PG_HOST`         | ✅        | Host de PostgreSQL                             | `localhost`         |
| `PG_DATABASE`     | ✅        | Nombre de la base de datos                     | `miapp_prod`        |
| `CORS_ORIGIN`     | ✅        | Orígenes permitidos (comas)                    | `https://miapp.cl`  |
| `LOG_LEVEL`       | ❌        | Nivel de logging (default: `info`)             | `debug`             |

---

## Deploy en Producción

### VPS (Ubuntu 22.04 + Nginx + PM2)

```bash
# 1. Conectar al servidor
ssh usuario@[ip-servidor]

# 2. Clonar y configurar
cd /var/www && git clone [repo-url] [nombre-app] && cd [nombre-app]
cp .env.example .env && nano .env

# 3. Instalar y migrar
npm ci --only=production
npm run migrate

# 4. Iniciar con PM2
pm2 start ecosystem.config.js --env production
pm2 save

# 5. Configurar Nginx (ver sección 7.1.4 del CLAUDE.md)
sudo nano /etc/nginx/sites-available/[nombre-app]
sudo ln -s /etc/nginx/sites-available/[nombre-app] /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 6. SSL
sudo certbot --nginx -d [dominio.cl]
```

### cPanel / Shared Hosting

```bash
# 1. Subir archivos vía Git o FTP al directorio ~/[nombre-app]/
# 2. cPanel → Software → Node.js → Create Application:
#    - Node.js version: 20.x
#    - Application mode: Production
#    - Application root: /[nombre-app]
#    - Application startup file: app.js
# 3. Agregar variables de entorno en la UI de Node.js Selector
# 4. Clic en "Run NPM Install"
# 5. Clic en "Restart"
```

---

## API Reference

Base URL: `https://[dominio]/api/v1`

### Autenticación

Todos los endpoints protegidos requieren header:
```
Authorization: Bearer [token]
```

### Endpoints

#### POST /auth/register
Registrar nuevo usuario.

**Body:**
```json
{
  "email": "usuario@ejemplo.cl",
  "password": "MínOcho8Chars!",
  "name": "Nombre Apellido"
}
```

**Response 201:**
```json
{
  "user": { "id": "uuid", "email": "...", "name": "..." },
  "token": "eyJ..."
}
```

---

## Troubleshooting

### La app no inicia

```bash
# Verificar logs
pm2 logs [nombre-app] --lines 100   # VPS
tail -f ~/logs/[app]-stderr.log      # cPanel

# Verificar que .env está completo
node -e "require('./src/config/env')"

# Verificar conexión a BD
node -e "require('./src/config/database').connect().then(() => console.log('OK'))"
```

### Error 500 en producción

```bash
# Ver logs completos con stack trace
pm2 logs [nombre-app] --err --lines 200

# Verificar que NODE_ENV=production está correctamente seteado
pm2 env [app-id] | grep NODE_ENV
```

---

## Mantenimiento

### Actualizar dependencias

```bash
npm outdated              # Ver qué hay desactualizado
npm update                # Actualizar dentro de semver
npm audit                 # Verificar vulnerabilidades
npm audit fix             # Corregir automáticamente las seguras
```

### Rotar JWT_SECRET

```bash
# 1. Generar nuevo secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# 2. Actualizar en .env (TODOS los servidores del cluster)
# 3. Reiniciar app (invalida todos los tokens activos — planificar ventana de mantenimiento)
pm2 restart [nombre-app]
```
```

---

## 10. CHECKLIST DE PRODUCCIÓN

Antes de hacer deploy de cualquier versión, verificar **cada ítem**:

```
SEGURIDAD
□ NODE_ENV=production en el servidor
□ JWT_SECRET generado con crypto.randomBytes(64), mínimo 64 caracteres
□ .env no está en el repositorio (.gitignore verificado)
□ Sin console.log() con datos sensibles en el código
□ Helmet y CORS configurados con valores reales (no wildcards en producción)
□ Rate limiting activo en todas las rutas /api
□ Inputs validados con express-validator o Joi en cada endpoint que recibe datos
□ SQL queries usan parámetros ($1, ?) — sin interpolación de strings

BASE DE DATOS
□ Migraciones ejecutadas y verificadas
□ Índices en campos de búsqueda frecuente (email, foreign keys, campos de filtro)
□ Pool size configurado acorde a los recursos del servidor
□ Backups automatizados configurados (cron + pg_dump o mysqldump)

APLICACIÓN
□ Health check respondiendo en /health
□ Graceful shutdown implementado (SIGTERM handler)
□ Error handler central captura todos los errores sin exponer stack traces
□ Logs escritos con nivel correcto (no debug en producción)
□ PM2 en modo cluster (VPS) o Passenger configurado (cPanel)
□ npm ci --only=production (sin devDependencies instaladas)

SERVIDOR
□ HTTPS forzado (HTTP → HTTPS redirect)
□ Certificado SSL válido y con auto-renovación
□ Firewall activo (solo puertos 22, 80, 443 abiertos)
□ Nginx configurado como reverse proxy con timeouts correctos
□ Server header de Nginx eliminado (server_tokens off en nginx.conf)

DOCUMENTACIÓN
□ README.md actualizado con instrucciones de instalación probadas
□ .env.example actualizado con todas las variables nuevas
□ CHANGELOG actualizado con cambios de esta versión
□ API Reference actualizada si se agregaron/modificaron endpoints
```

---

*Production App Development Standards · v1.0*
*Stack: Node.js · Express · Python · FastAPI · PostgreSQL · MySQL · MongoDB*
*Deploy: VPS/Linux · cPanel/Shared Hosting*
