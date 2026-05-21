---
version: 1.0.0
brand:
  name: EDU-US
  tagline: Conectando jóvenes peruanos con oportunidades académicas internacionales
tokens:
  colors:
    primary:
      value: "#ec451d"
      role: main CTA, action buttons, active highlights
    secondary:
      value: "#4db9a9"
      role: borders, light accents, badge backgrounds
    secondary-light:
      value: "#E0F2F0"
      role: light section backgrounds, panel grids
    accent:
      value: "#f5ba3c"
      role: icons backgrounds, warning indicators, yellow-gold gradients
    light:
      value: "#FFFFFF"
      role: main app background
    dark:
      value: "#222222"
      role: text, dark mode base backgrounds
  typography:
    headings:
      fontFamily: Space Grotesk
      fallback: sans-serif
      usage: h1, h2, h3, h4, h5, h6, and title components
    body:
      fontFamily: Nunito
      fallback: [ui-sans-serif, system-ui]
      usage: body text, paragraphs, labels, form descriptions
  layout:
    container: max-w-7xl
    padding: px-4 sm:px-6 lg:px-8
    spacing:
      section-y: py-12 sm:pt-12 lg:py-14
  shapes:
    pill: rounded-full
    card: rounded-xl
    hero-section: rounded-[3rem]
    standard-card: rounded-2xl
---

# Guía de Identidad Visual y Sistema de Diseño de EDU-US

Este documento describe la especificación de diseño visual y las reglas de implementación del frontend de EDU-US para que los agentes de codificación de IA y los desarrolladores humanos mantengan una consistencia perfecta.

---

## 1. Overview (Filosofía de Diseño)
EDU-US es una plataforma premium e inspiradora diseñada para conectar a jóvenes peruanos con oportunidades académicas, de voluntariado y becas internacionales. Su estética visual combina:
*   **Energía y Acción**: Transmitida por el color naranja (`primary`) y micro-animaciones dinámicas.
*   **Confianza y Seriedad**: Respaldada por el azul/turquesa (`secondary` y `secondary-light`) y tipografía limpia.
*   **Modernidad y Profesionalismo**: Representada por la tipografía geométrica `Space Grotesk` y un espaciado amplio y balanceado.

---

## 2. Colors (Paleta de Colores)

El proyecto utiliza Tailwind CSS para mapear la paleta de colores. Todos los colores deben derivarse del archivo `tailwind.config.js`.

*   **Primary (`#ec451d`)**: Color principal de acción. Usado para botones principales (CTA), indicadores de navegación activos e iconos destacados.
*   **Secondary (`#4db9a9`)**: Color secundario. Usado para bordes interactivos, fondos de píldoras informativas y elementos que necesitan contraste suave con el primario.
*   **Secondary Light (`#E0F2F0`)**: Fondo para paneles y secciones claras. Proporciona una base visual relajada.
*   **Accent (`#f5ba3c`)**: Amarillo-dorado brillante. Usado para iconos decorativos, fondos de insignias secundarias e hitos destacados.
*   **Dark (`#222222`)**: Usado para texto principal y base en temas oscuros.
*   **Light (`#FFFFFF`)**: Base de las tarjetas y páginas en tema claro.

### Degradados Autorizados
1.  **Primario a Dorado**: `bg-gradient-to-r from-primary to-[#b27a00]` (para textos destacados en títulos).
2.  **Fondo Suave de Tarjetas**: `linear-gradient(135deg, #fef2f2 0%, #f0fdfa 50%, #fef9e6 100%)` (usado para reversos de tarjetas dinámicas).

---

## 3. Typography (Tipografía)

EDU-US utiliza dos familias tipográficas cargadas a través de Google Fonts:

*   **Space Grotesk**:
    *   **Uso**: Todos los títulos (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`) por defecto.
    *   **Propósito**: Aportar una estética limpia, estructurada e innovadora.
*   **Nunito**:
    *   **Uso**: Contenido general del body, textos descriptivos, inputs y menús.
    *   **Propósito**: Facilitar la lectura continua gracias a sus terminaciones suaves y redondeadas.

---

## 4. Layout (Diseño y Espaciado)

*   **Ancho Máximo del Contenido**: El contenedor principal de cada sección debe llevar la clase `max-w-7xl mx-auto`.
*   **Padding Horizontal Estándar**: `px-4 sm:px-6 lg:px-8`.
*   **Padding Vertical de Secciones**:
    *   Clase de utilidad recomendada: `py-12 sm:pt-12 lg:py-14` para mantener consistencia en la separación de módulos de la página de inicio.

---

## 5. Elevation & Depth (Elevación y Sombras)

Para lograr un diseño "glassmorphic" y tridimensional premium, se utilizan sombras con colores semánticos:
*   **Sombra del Botón Primario**: `hover:shadow-xl hover:shadow-primary/30` para dar la sensación de iluminación.
*   **Bordes de Cristal**: Para contenedores tipo banner, usar bordes semi-transparentes combinados con blur: `bg-secondary/15 border border-secondary/30 backdrop-blur-md`.
*   **Efectos Flotantes**: Botones fijos (como el botón de WhatsApp) deben llevar sombras pronunciadas `shadow-2xl hover:shadow-primary/50` y un anillo animado pulsante (`animate-pulse`).

---

## 6. Shapes (Formas)

*   **Pills (Etiquetas informativas)**: `rounded-full` (ej. píldoras superiores en secciones).
*   **Tarjetas Estándar**: `rounded-2xl` para tarjetas de contenido (ej. About Cards, testimonios).
*   **Botones e Inputs**: `rounded-xl` o `rounded-md` para elementos de control.
*   **Heros y Grandes Contenedores**: `rounded-[3rem]` (ej. contenedor del CTA principal).

---

## 7. Components (Componentes Clave)

### A. Botones
*   **Botón Primario (Llamado a la Acción)**:
    ```html
    <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group">
      Texto de acción
    </button>
    ```
*   **Botón de Encabezado (Iniciar Sesión)**:
    ```html
    <button className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm shadow-primary/25">
      Iniciar sesión
    </button>
    ```

### B. Encabezado (Header)
*   **Efecto de Desplazamiento (Scroll)**:
    *   Sin scroll: `bg-white/60 backdrop-blur-lg border-b border-slate-100/40`
    *   Con scroll: `bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-black/5`

### C. Tarjetas Interactivas (Flip Cards)
*   Perspectiva 3D implementada con CSS Modules (`perspective: 1000px` y `transform-style: preserve-3d`) para efectos de rotación al pasar el cursor (`rotateY(180deg)`).

---

## 8. Do's and Don'ts (Reglas de Oro)

### ✅ Qué Hacer (Do's)
*   **Hacer**: Usar `Space Grotesk` estrictamente para títulos y `Nunito` para texto continuo.
*   **Hacer**: Aplicar `framer-motion` para transiciones de aparición (`initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}`).
*   **Hacer**: Respetar el contraste de texto claro sobre fondos de color. Utilizar escalas de `slate-900` o `gray-900` para texto de lectura principal sobre fondos claros.
*   **Hacer**: Usar la opacidad de los colores primario y secundario de Tailwind (ej. `bg-secondary/15`, `border-secondary/30`) para generar profundidades sofisticadas.

### ❌ Qué No Hacer (Don'ts)
*   **No hacer**: Introducir fuentes externas no declaradas como Roboto o Inter a menos que sea en clases aisladas heredadas.
*   **No hacer**: Usar colores base puros de Tailwind (`bg-red-500`, `bg-blue-600`) sin adaptarlos a la paleta oficial (`primary`, `secondary`, `accent`).
*   **No hacer**: Romper el espaciado global. Evitar agregar márgenes internos excesivos (`p-32`) o desproporcionados en pantallas móviles.
