# 🧩 Componentes UI Reutilizables

Esta es la lista de componentes que debes considerar organizar dentro de la carpeta `components/ui/`. Son bloques visuales reutilizables sin lógica de negocio.

---

## 📂 components/ui/

### ✅ Botones y Entradas

- **Button.jsx**  
  Botón reutilizable (primario, secundario, con ícono, etc.)

- **Input.jsx**  
  Campo de texto estándar con estilo personalizado

- **Textarea.jsx**  
  Área de texto para inputs más largos

- **Select.jsx**  
  Menú desplegable con opciones estilizadas

- **Checkbox.jsx**  
  Casilla de verificación con diseño propio

- **Switch.jsx**  
  Interruptor visual (toggle on/off)

---

### 🎨 Visuales y Estéticos

- **Card.jsx**  
  Contenedor con sombra/bordes para mostrar información (ej. oportunidades)

- **Avatar.jsx**  
  Imagen de perfil, ideal para usuarios (Google, etc.)

- **Badge.jsx**  
  Pequeñas etiquetas para mostrar estados o categorías

- **Alert.jsx**  
  Mensajes visuales (error, éxito, info)

- **Toast.jsx**  
  Notificaciones flotantes (puede integrarse con una lib como `sonner` o `react-toastify`)

---

### 💬 Navegación e Interacción

- **Modal.jsx**  
  Ventanas emergentes reutilizables (crear, confirmar, ver detalles)

- **Tabs.jsx**  
  Navegación por pestañas dentro de una misma vista

- **Dropdown.jsx**  
  Menú desplegable contextual (ej. perfil de usuario, filtros)

---

### 🔄 Estados y Carga

- **Loader.jsx**  
  Indicador de carga (spinner o barra)

---

## 🧠 Tips

- Todos los componentes aquí deben ser reutilizables.
- Evita incluir lógica de negocio.
- Puedes usar librerías como **ShadCN**, **Tailwind UI**, **Radix UI** como base para construirlos.

---
