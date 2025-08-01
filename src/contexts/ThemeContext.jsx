import { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  isDarkMode: false,
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);
  const isDarkMode = theme === 'dark';

  // Cargar el tema guardado del localStorage al montar el componente
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    setIsMounted(true);
  }, []);

  // Aplicar las clases de tema al elemento raíz cuando cambie el tema
  useEffect(() => {
    if (!isMounted) return;
    
    const root = window.document.documentElement;
    
    // Eliminar la clase anterior
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    // Agregar la nueva clase
    root.classList.add(theme);
    
    // Guardar la preferencia en localStorage
    localStorage.setItem('theme', theme);
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // No renderizar nada hasta que el componente esté montado
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
};