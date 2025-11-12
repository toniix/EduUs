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

  // console.log("analytics", analytics);
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

      // console.log("users", users);
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
    <div className={`p-6 bg-gray-50 ${isDark ? "bg-gray-800" : ""}`}>
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
          <div className={isDark ? "text-secondary-light" : "text-secondary"}>
            Última actualización: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analytics.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="text-primary">{item.icon}</div>
              <span
                className={`text-sm font-medium ${
                  isDark ? "text-green-400" : "text-green-500"
                }`}
              >
                {item.trend}
              </span>
            </div>
            <div className="mt-4">
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {item.value}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Recent Activity Section */}
      <div
        className={`rounded-lg shadow-sm p-6 mb-8 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 ${
                    isDark ? "bg-primary/20" : "bg-primary/10"
                  } rounded-full flex items-center justify-center`}
                >
                  <Users
                    className={`h-5 w-5 ${
                      isDark ? "text-primary-300" : "text-primary"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {activity.user}
                    </span>{" "}
                    {activity.action}{" "}
                    <span
                      className={isDark ? "text-primary-300" : "text-primary"}
                    >
                      {activity.item}
                    </span>
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
