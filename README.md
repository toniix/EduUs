# 🎓 Edu-US — Plataforma de Oportunidades Educativas

**Edu-US** es una plataforma web diseñada para conectar a jóvenes peruanos con oportunidades educativas y laborales. Acompaña el desarrollo de habilidades en empleabilidad, tecnología digital e inteligencia artificial, actuando como un puente entre el talento emergente y las demandas del mercado actual.

---

## ✨ Características

- 🔐 **Autenticación y Roles:** Registro, inicio de sesión y control de acceso (usuario y administrador) mediante Supabase Auth.
- 🎯 **Catálogo de Oportunidades (EduTracker):** Gestión (CRUD) y visualización de convocatorias educativas y laborales con recordatorios.
- 📅 **Gestión de Eventos:** Inscripción a talleres y eventos formativos con seguimiento universitario.
- 🏢 **Panel de Administración:** Dashboard interactivo con métricas clave y herramientas de administración de contenido.
- 📸 **Optimización de Imágenes:** Carga y optimización automática de imágenes mediante Cloudinary.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19, Vite 8, React Router DOM v7, Tailwind CSS, Framer Motion, Swiper.
- **Backend / BaaS:** Supabase (PostgreSQL, Auth, Storage y Edge Functions).
- **Imágenes:** Cloudinary.
- **Despliegue:** Vercel.

---

## ⚙️ Configuración y Desarrollo

### Prerrequisitos

- Node.js v18 o superior
- npm v9 o superior
- Proyecto configurado en Supabase
- Cuenta en Cloudinary

### Instalación local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/toniix/EduUs.git
   cd EduUs
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

   # Cloudinary Configuration
   VITE_CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
   ```

   > **Nota:** Las subidas de imágenes se gestionan a través de una Edge Function de Supabase (`upload-image`) que interactúa con la API de Cloudinary de forma segura desde el servidor.

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

---

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local con HMR.
- `npm run build`: Genera la compilación de producción optimizada en la carpeta `/dist`.
- `npm run preview`: Ejecuta localmente la compilación de producción para pruebas previas.
- `npm run lint`: Analiza el código fuente con ESLint.
