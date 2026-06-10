# Boxful API

Backend de la aplicación Boxful — envíos ultra-rápidos para LatAm.

## Tecnologías
- NestJS
- MongoDB Atlas
- Prisma ORM v5
- JWT Authentication
- class-validator / class-transformer

## Requisitos
- Node.js 18+
- MongoDB Atlas (o local)

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Fernandorec/boxful-backend.git
cd boxful-backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea el archivo `.env` en la raíz con estas variables:

```
DATABASE_URL="mongodb+srv://usuario:password@cluster.mongodb.net/boxful?retryWrites=true&w=majority"
JWT_SECRET="tu-clave-secreta"
WEBHOOK_SECRET="tu-clave-webhook"
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
npm run seed
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

### Órdenes (requieren JWT en header `Authorization: Bearer <token>`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/ordenes | Crear orden |
| GET | /api/ordenes | Listar órdenes con filtros |
| GET | /api/ordenes/:id | Obtener orden por ID |
| POST | /api/ordenes/:id/webhook | Actualizar estado (no requiere JWT) |

## Filtros disponibles en GET /api/ordenes

| Parámetro | Tipo | Ejemplo |
|-----------|------|---------|
| `estado` | string | `pending` / `delivered` |
| `esCOD` | boolean | `true` / `false` |
| `nombreDestinatario` | string | `Gabriela` |
| `fechaDesde` | YYYY-MM-DD | `2025-01-01` |
| `fechaHasta` | YYYY-MM-DD | `2025-12-31` |

## Webhook

El endpoint `POST /api/ordenes/:id/webhook` no requiere JWT. Se autentica con el header `x-webhook-secret`.

```bash
curl -X POST http://localhost:3001/api/ordenes/<id>/webhook \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: tu-clave-webhook" \
  -d '{"estado": "delivered", "montoRecolectado": 15.00}'
```

El campo `montoRecolectado` es opcional. Si no se envía, la orden se marca como entregada sin cobro (No COD).

## Costos de envío

Los costos base se configuran directamente en la base de datos mediante el seeder. Varían por día de la semana:

| Día | Costo base |
|-----|-----------|
| Lunes a viernes | $3.00 |
| Sábado | $3.50 |
| Domingo | $5.00 |

Para modificarlos, edita `prisma/seeder.ts` y vuelve a correr `npm run seed`.

## Lógica de liquidación COD

El sistema calcula automáticamente el monto a liquidar al comercio cuando se procesa un webhook:

- **Orden COD:** `Monto recolectado − Costo de envío − Comisión`
  - Comisión: 0.01% del monto recolectado, tope máximo de $25
- **Orden sin cobro (No COD):** `−Costo de envío` (valor negativo, es una deducción)

El monto recolectado real puede diferir del monto esperado al crear la orden. Los cálculos siempre se hacen con el monto real recibido en el webhook.

## Esfuerzos extra implementados
- Módulo de liquidación COD con webhook para recibir actualizaciones externas
- Cálculo automático de comisión y monto a liquidar al comercio por orden
- Costos de envío configurables por día de la semana desde base de datos
- ValidationPipe global con DTOs decorados (whitelist + transform)
- Guards separados por ruta: JWT para operaciones de usuario, secret para webhook