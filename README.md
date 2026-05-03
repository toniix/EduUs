# 🎓 Edu-US — Plataforma de Oportunidades Educativas

> **Repositorio privado** · Uso interno del equipo de desarrollo.

**Edu-US** es una plataforma web diseñada para conectar a jóvenes peruanos con oportunidades educativas y laborales. Acompaña el desarrollo de habilidades en empleabilidad, tecnología digital e inteligencia artificial, actuando como un puente entre el talento emergente y las demandas del mercado actual.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Módulos Principales](#-módulos-principales)
- [Base de Datos (Supabase)](#-base-de-datos-supabase)
- [Flujo de Trabajo Git](#-flujo-de-trabajo-git)

---

## 🛠️ Stack Tecnológico

| Capa              | Tecnología                                          |
| ----------------- | --------------------------------------------------- |
| **UI Framework**  | React 19 + Vite 6                                   |
| **Routing**       | React Router DOM v7                                 |
| **Estilos**       | Tailwind CSS 3.4 + CSS Modules                      |
| **Animaciones**   | Framer Motion 12                                    |
| **Backend/BaaS**  | Supabase (PostgreSQL + Auth + Storage + Edge Fns)   |
| **Imágenes**      | Cloudinary                                          |
| **Iconos**        | Lucide React + React Icons                          |
| **Validaciones**  | Zod                                                 |
| **Notificaciones**| React Hot Toast                                     |
| **Carrusel**      | Swiper 12                                           |
| **Analytics**     | Vercel Analytics                                    |
| **Linting**       | ESLint 9 (Flat Config)                              |

---

## 📁 Arquitectura del Proyecto

```
edu-us/
├── api/                        # Scripts de utilidad del servidor (sitemap, etc.)
├── supabase/                   # Configuración local de Supabase CLI
│   ├── config.toml
│   └── functions/              # Edge Functions de Supabase
├── public/                     # Activos estáticos servidos directamente
└── src/
    ├── assets/                 # Imágenes, fuentes y recursos estáticos del proyecto
    ├── components/
    │   ├── admin/              # Componentes exclusivos del panel administrativo
    │   │   ├── forms/          # Formularios del admin (EventForm, CategoryForm)
    │   │   ├── tabs/           # Tabs del dashboard (RegistrationsTab, EventsAdminTab…)
    │   │   ├── AdminPanelHeader.jsx
    │   │   ├── EventBannerUpload.jsx
    │   │   ├── EventDetailDrawer.jsx
    │   │   ├── EventPreviewModal.jsx
    │   │   ├── EventsRegistrationsTable.jsx
    │   │   ├── OpportunityActionsMenu.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── UserActionsMenu.jsx
    │   ├── auth/               # Sub-componentes de autenticación (AuthError…)
    │   ├── events/             # Componentes del módulo de eventos públicos
    │   ├── home/               # Secciones específicas de la página Home
    │   │   ├── AboutSection.jsx
    │   │   ├── CallToAction.jsx
    │   │   ├── ImpactCard.jsx
    │   │   ├── ImpactSection.jsx
    │   │   ├── OfferSection.jsx
    │   │   └── TestimonialsSection.jsx
    │   ├── layouts/            # Layouts y wrappers de estructura de página
    │   │   ├── header/         # UserMenu y UserMenuMobile
    │   │   ├── wrappers/       # DesktopOnlyWrapper, FooterWrapper, HeaderWrapper
    │   │   └── PublicLayout.jsx
    │   ├── opportunities/      # Catálogo, detalle y formulario de oportunidades
    │   └── ui/                 # Componentes reutilizables (Button, Input, Modal…)
    ├── contexts/               # Contextos globales de React (Auth, Theme, Opportunity)
    ├── data/                   # Datos estáticos (offers.js, statsData.js, testimonials.js…)
    ├── hooks/                  # Custom hooks (useEvents, useOpportunities, useReminders…)
    ├── lib/                    # Clientes externos (supabase.js, cloudinary.js)
    ├── pages/
    │   ├── admin/              # AdminPanel.jsx
    │   ├── opportunities/      # Opportunities.jsx
    │   ├── Home.jsx
    │   ├── About.jsx
    │   ├── Projects.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Profile.jsx
    │   ├── Privacy.jsx
    │   ├── Terms.jsx
    │   └── NotFound.jsx
    ├── routes/                 # Guards de navegación únicamente
    │   ├── RoleGuard.jsx       # Autorización por rol (admin / user)
    │   ├── ProtectedRoute.jsx  # Requiere autenticación
    │   ├── PublicRoute.jsx     # Solo para usuarios no autenticados
    │   └── AuthCallback.jsx    # Callback OAuth de Supabase
    ├── services/               # Capa de acceso a datos (Supabase queries)
    │   ├── AuthService.js
    │   ├── categoryService.js
    │   ├── cloudinaryService.js
    │   ├── dashboardService.js
    │   ├── eventsService.js
    │   ├── fetchOpportunityService.js
    │   ├── opportunityService.js
    │   ├── rolesService.js
    │   └── userService.js
    ├── utils/                  # Funciones de utilidad puras y constantes
    │   ├── constants.js        # Constantes globales (ROLES, mensajes de error…)
    │   ├── validationSchemas.js# Esquemas Zod (auth, oportunidades, eventos)
    │   ├── events.js
    │   ├── formatDate.js
    │   ├── opportunity.js
    │   ├── slugify.js
    │   └── cloudinaryOptimize.js
    ├── App.jsx
    └── main.jsx
```

---

## ⚙️ Configuración del Entorno

### Prerrequisitos

- **Node.js** v18 o superior
- **npm** v9 o superior
- Acceso al proyecto en **Supabase** (solicitar al líder técnico)
- Acceso a la cuenta de **Cloudinary** del equipo

### 1. Clonar el repositorio

```bash
git clone <URL-del-repo-privado>
cd edu-us
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto (ver la sección siguiente). **Nunca subas este archivo al repositorio.**

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🔑 Variables de Entorno

El archivo `.env` ya está incluido en `.gitignore`. Las variables necesarias son:

```env
# Supabase
VITE_SUPABASE_URL=           # URL del proyecto en Supabase
VITE_SUPABASE_ANON_KEY=      # Anon key pública del proyecto

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=  # Nombre del cloud en Cloudinary
VITE_CLOUDINARY_UPLOAD_PRESET= # Upload preset sin firma (unsigned)
```

> **Nota:** Los valores reales se comparten internamente de forma segura (no en este README).

---

## 📦 Scripts Disponibles

| Comando           | Descripción                                          |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo con HMR             |
| `npm run build`   | Genera el bundle optimizado para producción en `/dist`|
| `npm run preview` | Sirve el build de producción localmente              |
| `npm run lint`    | Ejecuta ESLint sobre todo el código fuente           |

---

## 🧩 Módulos Principales

### 🔐 Autenticación (`AuthService.js` + `AuthContext`)
- Login / Registro / Recuperación de contraseña vía **Supabase Auth**
- Verificación de email
- Sistema de roles: `user` y `admin`
- Guards de rutas protegidas en `/routes`

### 🎯 EduTracker — Oportunidades (`opportunityService.js`, `fetchOpportunityService.js`)
- CRUD completo de oportunidades educativas y laborales
- Filtrado por categoría y estado (activa/inactiva)
- Paginación del lado del servidor
- Recordatorios personalizados

### 📅 Eventos (`eventsService.js`)
- Creación y gestión de eventos educativos
- Registro de participantes con datos universitarios
- Panel de inscripciones con filtros y búsqueda en el admin

### 🏢 Panel Administrativo (`/pages/admin`, `/components/admin`)
- Dashboard con métricas de uso (`dashboardService.js`)
- Gestión de oportunidades, categorías, usuarios y eventos
- Control de acceso basado en roles (RBAC) mediante `RoleGuard.jsx`

### 📸 Imágenes (`cloudinaryService.js`)
- Upload directo desde el cliente usando un preset unsigned
- Gestión y optimización de banners/imágenes de oportunidades

---

## 🗄️ Base de Datos (Supabase)

El esquema de la base de datos se gestiona desde el dashboard de Supabase o mediante la **Supabase CLI** (configuración local en `/supabase/config.toml`).

Las **Edge Functions** del proyecto se encuentran en `/supabase/functions/`.

Para acceder al panel de Supabase, solicitar acceso al líder técnico del proyecto.

---

## 🌿 Flujo de Trabajo Git

Este repositorio sigue un flujo basado en ramas por funcionalidad:

```
main              ← rama de producción (protegida)
└── dev           ← rama de integración / staging
    └── feat/...  ← ramas de nuevas funcionalidades
    └── fix/...   ← ramas de corrección de bugs
    └── chore/... ← tareas de mantenimiento (deps, config, etc.)
```

### Convenciones de commits

Se sigue el estándar **Conventional Commits**:

```
feat: agregar filtro por universidad en RegistrationsTab
fix: corregir error en r.dni?.includes() con valores null
chore: actualizar dependencias de Supabase
refactor: extraer EventDetailDrawer a componente separado
docs: actualizar README para repositorio privado
```

### Proceso para nuevas funcionalidades

1. Crear rama desde `dev`: `git checkout -b feat/nombre-feature`
2. Desarrollar y hacer commits descriptivos
3. Abrir Pull Request hacia `dev`
4. Code review por al menos un miembro del equipo
5. Merge a `dev` → verificación en staging
6. Merge a `main` → despliegue automático en Vercel

---

## 🚀 Despliegue

El proyecto se despliega automáticamente en **Vercel** al hacer push a `main`.

La configuración de rutas SPA está definida en `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
