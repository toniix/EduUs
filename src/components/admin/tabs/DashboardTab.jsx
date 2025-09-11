import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  GraduationCap,
  BookOpen,
  RefreshCcw,
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import {
  getUserCount,
  getOpportunitiesCount,
  getActiveOpportunitiesCount,
  getExpiredOpportunitiesCount,
  getPreviousUserCount,
  getPreviousOpportunitiesCount,
} from "../../../services/dashboardService";
import { getGrowth } from "../../../utils/dashboard";

const initialAnalytics = [
  {
    key: "users",
    title: "Usuarios registrados",
    value: 0,
    icon: <Users className="h-8 w-8" />,
    trend: "0%",
  },
  {
    key: "opportunities",
    title: "Oportunidades publicadas",
    value: 0,
    icon: <GraduationCap className="h-8 w-8" />,
    trend: "0%",
  },
  {
    key: "active",
    title: "Oportunidades activas",
    value: 0,
    icon: <BookOpen className="h-8 w-8" />,
    trend: "0%",
  },
  {
    key: "expired",
    title: "Oportunidades vencidas",
    value: 0,
    icon: <Award className="h-8 w-8" />,
    trend: "0%",
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

const DashboardTab = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const { isDark } = useContext(ThemeContext);

  console.log("analytics", analytics);
  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      // Set your period for growth calculation (e.g. last week)
      const now = new Date();
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      const lastWeekISO = lastWeek.toISOString();

      const [users, usersPrev, opps, oppsPrev, active, expired] =
        await Promise.all([
          getUserCount(),
          getPreviousUserCount(lastWeekISO),
          getOpportunitiesCount(),
          getPreviousOpportunitiesCount(lastWeekISO),
          getActiveOpportunitiesCount(),
          getExpiredOpportunitiesCount(),
        ]);

      setAnalytics([
        {
          key: "users",
          title: "Usuarios registrados",
          value: users,
          icon: <Users className="h-8 w-8" />,
          trend: getGrowth(users, usersPrev),
        },
        {
          key: "opportunities",
          title: "Oportunidades publicadas",
          value: opps,
          icon: <GraduationCap className="h-8 w-8" />,
          trend: getGrowth(opps, oppsPrev),
        },
        {
          key: "active",
          title: "Oportunidades activas",
          value: active,
          icon: <BookOpen className="h-8 w-8" />,
        },
        {
          key: "expired",
          title: "Oportunidades vencidas",
          value: expired,
          icon: <Award className="h-8 w-8" />,
        },
      ]);
    } catch (err) {
      // Manejo de error (puedes mostrar un toast o alert)
      console.error("Error al cargar estadísticas:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = fetchStats;

  return (
    <div className={`p-6 bg-gray-50 pt-24 ${isDark ? "bg-gray-900" : ""}`}>
      <div className="flex justify-between items-center mb-6">
        <h1
          className={
            "text-2xl font-bold " + (isDark ? "text-white" : "text-gray-800")
          }
        >
          Dashboard
        </h1>
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
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
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
      </div> */}
    </div>
  );
};

export default DashboardTab;
