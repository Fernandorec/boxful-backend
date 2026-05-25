# Boxful API

Backend de la aplicación Boxful — envíos ultra-rápidos para LatAm.

## Tecnologías
- NestJS
- MongoDB Atlas
- Prisma ORM v5
- JWT Authentication

## Requisitos
- Node.js 18+
- MongoDB (local o Atlas)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Fernandorec/boxful-api.git
cd boxful-api
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea el archivo `.env` en la raíz con estas variables:

```
DATABASE_URL="mongodb+srv://usuario:password@cluster.mongodb.net/boxful"
JWT_SECRET="tu-clave-secreta"
PORT=3001
```

4. Genera el cliente de Prisma:

```bash
npx prisma generate
```

5. Sincroniza la base de datos:

```bash
npx prisma db push
```

6. Corre el seeder de costos de envío:

```bash
npx ts-node --esm prisma/seeder.ts
```

7. Inicia el servidor:

```bash
npm run start:dev
```

El servidor corre en `http://localhost:3001`

## Endpoints

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/registro | Registro de usuario |
| POST | /api/auth/login | Inicio de sesión |

### Órdenes (requieren JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/ordenes | Crear orden |
| GET | /api/ordenes | Listar órdenes con filtros |
| GET | /api/ordenes/:id | Obtener orden por ID |
| POST | /api/ordenes/:id/webhook | Actualizar estado de orden |

## Filtros disponibles en GET /api/ordenes
- `estado` — pending / delivered
- `esCOD` — true / false
- `nombreDestinatario` — búsqueda por nombre
- `fechaDesde` — fecha inicio (YYYY-MM-DD)
- `fechaHasta` — fecha fin (YYYY-MM-DD)

## Lógica de liquidación COD
- **COD:** Monto recolectado − costo de envío − comisión (0.01% del monto, tope $25)
- **Sin cobro:** −costo de envío

## Esfuerzos extra
- Webhook para actualizar estado y monto recolectado de órdenes COD
- Seeder de costos de envío configurables por día de la semana
- Cálculo automático de liquidación al comercio

