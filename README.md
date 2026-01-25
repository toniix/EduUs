# 🎓 Edu-US - Plataforma de Oportunidades Educativas

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2.49.3-3FCF8E?logo=supabase)

**Edu-US** es una plataforma web innovadora diseñada para conectar a jóvenes peruanos con oportunidades educativas y laborales. Nuestra misión es acompañar el desarrollo de habilidades en empleabilidad, tecnología digital e inteligencia artificial, actuando como un puente entre el talento emergente y las demandas del mercado actual.

---

## ✨ Características Principales

## 🔐 Autenticación y Autorización

- Registro e login seguros con Supabase Auth
- Verificación de email
- Recuperación de contraseñas
- Sistema de roles (Usuario, Admin)
- Guards para rutas protegidas
- Callbacks de autenticación OAuth

### 🎯 EduTracker - Sistema de Oportunidades

- **Catálogo dinámico** de oportunidades educativas y laborales
- **Filtrado avanzado** por categoría y estado
- **Paginación optimizada** para mejor UX
- **Detalles completos** de cada oportunidad
- **Estados de oportunidad**: Activas, Inactivas
- **Recordatorios** personalizados para no perder plazos

### 👤 Perfiles de Usuario

- Panel de perfil personal
- Gestión de información de contacto
- Historial de oportunidades guardadas
- Preferencias personalizadas

### 🏢 Panel Administrativo

- Dashboard completo para administradores
- Gestión de oportunidades (CRUD)
- Creación y edición de categorías
- Monitoreo de usuarios
- Reportes de engagement
- Control de acceso basado en roles (RBAC)

### 🎨 Interfaz Responsive

- Diseño mobile-first
- Navegación adaptativa para dispositivos móviles
- Modo oscuro/claro
- Componentes reutilizables
- Accesibilidad mejorada

### 📝 Contenido Estático

- Página de Inicio con hero section
- Página "Nosotros" con historia y valores
- Galería de Proyectos
- Sección de Testimonios
- Términos y Condiciones
- Política de Privacidad

---

## 📁 Estructura del Proyecto

El proyecto sigue una estructura organizada para facilitar la escalabilidad y el mantenimiento:

```
/src
|-- /assets
|-- /components
|   |-- /admin
|   |-- /auth
|   |-- /layouts
|   |-- /opportunities
|   `-- /ui
|-- /contexts
|-- /data
|-- /hooks
|-- /lib
|-- /pages
|   |-- /admin
|   `-- /opportunities
|-- /routes
|-- /services
|-- /styles
|-- /utils
|-- App.jsx
|-- main.jsx
```

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 19:** Librería principal para la interfaz de usuario.
- **Vite:** Herramienta de construcción y servidor de desarrollo.
- **React Router:** Para la gestión de rutas en la aplicación.
- **Tailwind CSS:** Framework de CSS para un diseño rápido y personalizable.
- **Lucide React / React Icons:** Para la iconografía.

### Backend & Base de Datos

- **Supabase:** Plataforma de Backend as a Service (BaaS) que provee base de datos (PostgreSQL), autenticación y APIs.
- **Cloudinary:** Para el almacenamiento y gestión de imágenes.

### Herramientas de Desarrollo

- **ESLint:** Para el análisis estático del código y mantenimiento de la calidad.
- **Zod:** Para la validación de esquemas de datos.

---

## 🚀 Guía de Inicio Rápido

Para configurar y ejecutar el proyecto en tu entorno local, sigue estos pasos:

### Prerrequisitos

- Node.js (v18 o superior)
- npm, yarn, o pnpm
- Una cuenta de Supabase para obtener las credenciales de la API.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/edu-us.git
cd edu-us
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

### 4. Ejecutar el Proyecto

Una vez configurado, puedes iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 📦 Scripts Disponibles

| Comando           | Descripción                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Inicia servidor de desarrollo con HMR |
| `npm run build`   | Compila la aplicación para producción |
| `npm run preview` | Previsualiza el build de producción   |
| `npm run lint`    | Ejecuta ESLint para verificar código  |

---

## 📚 Documentación Adicional

- [Supabase Docs](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📄 Licencia

Este proyecto está distribuido bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
