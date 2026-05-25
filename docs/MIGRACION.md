# Migración a React + Node.js + PostgreSQL + Prisma

## 📊 Schema de Base de Datos

### Esquema Prisma (prisma/schema.prisma)

```prisma
// ═══════════════════════════════════════════════════════════════
// PRISMA SCHEMA - Módulo de Cotizaciones Vikingos
// ═══════════════════════════════════════════════════════════════

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══ ENTIDADES PRINCIPALES ═══

model Cliente {
  id           Int          @id @default(autoincrement())
  nombre       String       @db.VarChar(255)
  telefono     String?      @db.VarChar(50)
  email        String?      @db.VarChar(255)
  direccion    String?      @db.Text
  creadoEn     DateTime     @default(now())
  actualizado  DateTime     @updatedAt

  cotizaciones Cotizacion[]
}

model Cotizacion {
  id                Int           @id @default(autoincrement())
  proyecto          String        @db.VarChar(255)
  descripcion       String?       @db.Text
  
  // FK
  clienteId         Int
  cliente           Cliente       @relation(fields: [clienteId], references: [id])
  categoriaId       Int?
  categoria         Categoria?    @relation(fields: [categoriaId], references: [id])
  
  // Especificaciones
  tamano            String?       @db.VarChar(50)
  ancho             Decimal?      @db.Decimal(10,2)
  alto              Decimal?      @db.Decimal(10,2)
  fondo             Decimal?      @db.Decimal(10,2)
  colorHex          String?       @db.VarChar(7)
  colorNombre       String?       @db.VarChar(50)
  tiempoEntrega     Int           @default(15)
  
  // Costos
  costosMateriales Decimal       @db.Decimal(12,2) @default(0)
  costosManoObra   Decimal       @db.Decimal(12,2) @default(0)
  overhead         Decimal       @db.Decimal(5,2)  @default(15)
  overheadMonto    Decimal       @db.Decimal(12,2) @default(0)
  margen           Decimal       @db.Decimal(5,2)  @default(30)
  margenMonto      Decimal       @db.Decimal(12,2) @default(0)
  total            Decimal       @db.Decimal(12,2) @default(0)
  
  // Estado
  estado           EstadoEnum    @default(PENDIENTE)
  
  // Fechas
  fechaCreacion    DateTime      @default(now())
  fechaActualizacion DateTime  @updatedAt
  fechaEnvio       DateTime?
  fechaAprobacion  DateTime?
  fechaProduccion  DateTime?
  fechaFinalizacion DateTime?
  fechaArchivado   DateTime?
  
  // Relaciones
  materiales       CotizacionMaterial[]
  manoObra         ManoObra?
  recordatorios    Recordatorio[]
  versiones        CotizacionVersion[]
  archivos         Archivo[]

  @@index([clienteId])
  @@index([estado])
  @@index([fechaCreacion])
}

// ═══ CATALOGOS ═══

model Categoria {
  id           Int          @id @default(autoincrement())
  nombre       String       @db.VarChar(100)
  icono        String?      @db.VarChar(20)
  activo       Boolean      @default(true)
  
  cotizaciones Cotizacion[]
}

model Material {
  id           Int          @id @default(autoincrement())
  nombre       String       @db.VarChar(255)
  unidad       String       @db.VarChar(20)
  precio       Decimal      @db.Decimal(12,2)
  categoria    String?      @db.VarChar(100)
  activo       Boolean      @default(true)
  
  preciosHistoricos PrecioMaterial[]
}

model PrecioMaterial {
  id          Int       @id @default(autoincrement())
  materialId  Int
  material    Material  @relation(fields: [materialId], references: [id])
  precio      Decimal   @db.Decimal(12,2)
  fechaInicio DateTime @default(now())
}

// ═══ RELACIONES DETALLE ═══

model CotizacionMaterial {
  id            Int         @id @default(autoincrement())
  cotizacionId  Int
  cotizacion    Cotizacion @relation(fields: [cotizacionId], references: [id], onDelete: Cascade)
  materialId    Int?
  nombre        String      @db.VarChar(255)
  cantidad      Decimal     @db.Decimal(10,3)
  unidad        String      @db.VarChar(20)
  precioUnitario Decimal    @db.Decimal(12,2)
  total         Decimal     @db.Decimal(12,2)
  
  @@index([cotizacionId])
}

model ManoObra {
  id            Int         @id @default(autoincrement())
  cotizacionId  Int         @unique
  cotizacion    Cotizacion @relation(fields: [cotizacionId], references: [id], onDelete: Cascade)
  tarea         String?     @db.VarChar(255)
  horas         Decimal     @db.Decimal(8,2)
  colaborador   String?     @db.VarChar(255)
  tarifa        Decimal     @db.Decimal(12,2)
  total         Decimal     @db.Decimal(12,2)
}

model Recordatorio {
  id            Int         @id @default(autoincrement())
  cotizacionId  Int
  cotizacion    Cotizacion @relation(fields: [cotizacionId], references: [id], onDelete: Cascade)
  titulo        String      @db.VarChar(255)
  nota          String?     @db.Text
  fecha         DateTime
  completado    Boolean     @default(false)
  creadoEn      DateTime    @default(now())
  
  @@index([cotizacionId])
}

model CotizacionVersion {
  id            Int         @id @default(autoincrement())
  cotizacionId  Int
  cotizacion    Cotizacion @relation(fields: [cotizacionId], references: [id], onDelete: Cascade)
  version       Int
  datos         Json
  creadoPor     String?     @db.VarChar(100)
  creadoEn      DateTime    @default(now())
  
  @@index([cotizacionId])
}

model Archivo {
  id            Int         @id @default(autoincrement())
  cotizacionId  Int
  cotizacion    Cotizacion @relation(fields: [cotizacionId], references: [id], onDelete: Cascade)
  nombre        String      @db.VarChar(255)
  tipo          String      @db.VarChar(20)
  url           String      @db.Text
  creadoEn      DateTime    @default(now())
  
  @@index([cotizacionId])
}

// ═══ ENUMS ═══

enum EstadoEnum {
  PENDIENTE
  ENVIADA
  APROBADA
  PRODUCCION
  FINALIZADA
  ARCHIVADA
  RECHAZADA
}
```

---

## 🔌 API REST

### Endpoints sugeridos

```
GET    /api/cotizaciones              → Listar con filtros
GET    /api/cotizaciones/:id          → Obtener una
POST   /api/cotizaciones              → Crear
PUT    /api/cotizaciones/:id          → Actualizar
PATCH  /api/cotizaciones/:id/estado  → Cambiar estado
DELETE /api/cotizaciones/:id          → Eliminar

GET    /api/cotizaciones/:id/versiones → Historial
POST   /api/cotizaciones/:id/duplicar → Duplicar

GET    /api/clientes                  → Listar clientes
POST   /api/clientes                  → Crear cliente

GET    /api/materiales                → Catálogo materiales
POST   /api/materiales                → Agregar material
```

---

## ⚛️ Estructura Frontend (React)

```
src/
├── components/
│   ├── cotizacion/
│   │   ├── CotizacionForm.jsx
│   │   ├── CotizacionCard.jsx
│   │   ├── CotizacionList.jsx
│   │   ├── CotizacionPreview.jsx
│   │   └── EstadoBadge.jsx
│   └── common/
│       ├── Modal.jsx
│       └── FilterBar.jsx
├── hooks/
│   ├── useCotizaciones.js
│   └── useClientes.js
├── services/
│   └── api.js
├── pages/
│   ├── NuevaCotizacion.jsx
│   ├── ListadoCotizaciones.jsx
│   └── DetalleCotizacion.jsx
└── store/
    └── cotizacionStore.js
```

---

## 🚀 Pasos de Migración

1. **Fase 1 - Backend**
   - Crear proyecto Node/Express o Next.js API
   - Configurar Prisma + PostgreSQL
   - Crear migraciones
   - Implementar endpoints CRUD

2. **Fase 2 - Frontend**
   - Crear proyecto React/Vite
   - Migrar componentes uno por uno
   - Reemplazar localStorage por llamadas API

3. **Fase 3 - Funcionalidades**
   - Autenticación
   - Roles (admin/vendedor)
   - Exportar PDF en server (Puppeteer)

4. **Fase 4 - Optimización**
   - Paginación
   - Cacheo con React Query
   - Notificaciones push