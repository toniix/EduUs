import React, { useState } from "react";
import {
  Users,
  FileText,
  Calendar,
  Eye,
  Award,
  Globe,
  Mail,
  TrendingUp,
  Activity,
  GraduationCap,
  BookOpen,
  MapPin,
  RefreshCcw,
} from "lucide-react";

const analytics = [
  {
    title: "Usuarios registrados",
    value: 256,
    icon: <Users className="h-8 w-8" />,
    trend: "+12%",
  },
  {
    title: "Oportunidades publicadas",
    value: 142,
    icon: <GraduationCap className="h-8 w-8" />,
    trend: "+5%",
  },
  {
    title: "Aplicaciones activas",
    value: 38,
    icon: <BookOpen className="h-8 w-8" />,
    trend: "+8%",
  },
  {
    title: "Visitas totales",
    value: 823,
    icon: <Activity className="h-8 w-8" />,
    trend: "+25%",
  },
  {
    title: "Becas disponibles",
    value: 45,
    icon: <Award className="h-8 w-8" />,
    trend: "+15%",
  },
  {
    title: "Países alcanzados",
    value: 28,
    icon: <MapPin className="h-8 w-8" />,
    trend: "+2%",
  },
  {
    title: "Suscriptores",
    value: 567,
    icon: <Mail className="h-8 w-8" />,
    trend: "+18%",
  },
  {
    title: "Tasa de conversión",
    value: "12.5%",
    icon: <TrendingUp className="h-8 w-8" />,
    trend: "+3%",
  },
];

const recentActivity = [
  {
    user: "María González",
    action: "aplicó a",
    item: "Beca Fullbright 2024",
    time: "hace 2 horas",
  },
  {
    user: "Juan Pérez",
    action: "publicó",
    item: "Nueva oportunidad en España",
    time: "hace 3 horas",
  },
  {
    user: "Ana Silva",
    action: "actualizó",
    item: "Intercambio cultural Japón",
    time: "hace 5 horas",
  },
  {
    user: "Carlos Ruiz",
    action: "se registró",
    item: "como nuevo usuario",
    time: "hace 6 horas",
  },
];

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Aquí iría la lógica para recargar los datos
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación de carga
    setIsRefreshing(false);
  };

  return (
    <div className="p-6 bg-gray-50 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCcw
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
          <div className="text-sm text-gray-500">
            Última actualización: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analytics.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="text-primary">{item.icon}</div>
              <span className="text-green-500 text-sm font-medium">
                {item.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-800">{item.value}</h3>
              <p className="text-gray-500 text-sm">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium text-gray-800">
                      {activity.user}
                    </span>{" "}
                    {activity.action}{" "}
                    <span className="text-primary">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-3 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            Nueva Oportunidad
          </button>
          <button className="p-3 text-sm font-medium text-secondary bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors">
            Gestionar Usuarios
          </button>
          <button className="p-3 text-sm font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
