import { Home, Users, FileText, BarChart2, Settings } from "lucide-react";

export const menuItems = [
  { icon: <Home />, label: "Dashboard", value: "dashboard" },
  { icon: <Users />, label: "Usuarios", value: "users" },
  {
    icon: <FileText />,
    label: "Contenido",
    value: "content",
    subItems: [
      { label: "Oportunidades", value: "content-opportunities" },
      { label: "Noticias", value: "content-news" },
      { label: "Blog", value: "content-blog" },
    ],
  },
  { icon: <BarChart2 />, label: "Analíticas", value: "analytics" },
  { icon: <Settings />, label: "Configuración", value: "settings" },
];
