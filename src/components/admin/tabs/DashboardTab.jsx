import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Users,
  Award,
  GraduationCap,
  BookOpen,
  Calendar,
  CalendarCheck,
  Ticket,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import {
  getUserCount,
  getOpportunitiesCount,
  getActiveOpportunitiesCount,
  getExpiredOpportunitiesCount,
  getPreviousUserCount,
  getPreviousOpportunitiesCount,
  getEventsCount,
  getUpcomingEventsCount,
  getEventRegistrationsCount,
  getPreviousEventsCount,
  getPreviousEventRegistrationsCount,
  getRecentActivity,
} from "../../../services/dashboardService";
import { getGrowth } from "../../../utils/dashboard";

function formatRelativeTime(iso) {
  if (!iso) return "recientemente";
  const now = new Date();
  const date = new Date(iso);
  const diffInSec = Math.max(0, Math.floor((now - date) / 1000));
  if (diffInSec < 60) return "hace un momento";
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `hace ${diffInMin} min`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24)
    return `hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;
}

const initialAnalytics = [
  {
    key: "users",
    title: "Usuarios registrados",
    value: 0,
    icon: <Users className="h-7 w-7" />,
    trend: "0%",
  },
  {
    key: "opportunities",
    title: "Oportunidades publicadas",
    value: 0,
    icon: <GraduationCap className="h-7 w-7" />,
    trend: "0%",
  },
  {
    key: "active",
    title: "Oportunidades activas",
    value: 0,
    icon: <BookOpen className="h-7 w-7" />,
  },
  {
    key: "events",
    title: "Eventos creados",
    value: 0,
    icon: <Calendar className="h-7 w-7" />,
    trend: "0%",
  },
  {
    key: "upcoming_events",
    title: "Eventos próximos",
    value: 0,
    icon: <CalendarCheck className="h-7 w-7" />,
  },
  {
    key: "registrations",
    title: "Inscripciones a eventos",
    value: 0,
    icon: <Ticket className="h-7 w-7" />,
    trend: "0%",
  },
];

const DashboardTab = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [recentActivities, setRecentActivities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { isDark } = useContext(ThemeContext);

  const fetchStats = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const now = new Date();
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      const lastWeekISO = lastWeek.toISOString();

      const [
        users,
        usersPrev,
        opps,
        oppsPrev,
        activeOpps,
        events,
        eventsPrev,
        upcomingEvents,
        registrations,
        registrationsPrev,
        activities,
      ] = await Promise.all([
        getUserCount(),
        getPreviousUserCount(lastWeekISO),
        getOpportunitiesCount(),
        getPreviousOpportunitiesCount(lastWeekISO),
        getActiveOpportunitiesCount(),
        getEventsCount(),
        getPreviousEventsCount(lastWeekISO),
        getUpcomingEventsCount(),
        getEventRegistrationsCount(),
        getPreviousEventRegistrationsCount(lastWeekISO),
        getRecentActivity(),
      ]);

      setAnalytics([
        {
          key: "users",
          title: "Usuarios registrados",
          value: users,
          icon: <Users className="h-7 w-7" />,
          trend: getGrowth(users, usersPrev),
        },
        {
          key: "opportunities",
          title: "Oportunidades publicadas",
          value: opps,
          icon: <GraduationCap className="h-7 w-7" />,
          trend: getGrowth(opps, oppsPrev),
        },
        {
          key: "active",
          title: "Oportunidades activas",
          value: activeOpps,
          icon: <BookOpen className="h-7 w-7" />,
        },
        {
          key: "events",
          title: "Eventos creados",
          value: events,
          icon: <Calendar className="h-7 w-7" />,
          trend: getGrowth(events, eventsPrev),
        },
        {
          key: "upcoming_events",
          title: "Eventos próximos",
          value: upcomingEvents,
          icon: <CalendarCheck className="h-7 w-7" />,
        },
        {
          key: "registrations",
          title: "Inscripciones a eventos",
          value: registrations,
          icon: <Ticket className="h-7 w-7" />,
          trend: getGrowth(registrations, registrationsPrev),
        },
      ]);

      setRecentActivities(activities);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error al cargar estadísticas del dashboard:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div
      className={`p-6 min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading">Dashboard</h1>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mt-0.5`}
          >
            Métricas clave de oportunidades, eventos y usuarios de EDU-US
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchStats}
            className={`p-2 text-gray-500 hover:text-primary rounded-xl border ${
              isDark
                ? "border-gray-700 hover:bg-gray-800"
                : "border-gray-200 hover:bg-white"
            } transition-colors shadow-sm`}
            disabled={isRefreshing}
            title="Actualizar datos"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
          </button>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Última actualización:{" "}
            {lastUpdated.toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid (6 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {analytics.map((item) => (
          <div
            key={item.key}
            className={`rounded-2xl p-5 border transition-all duration-200 hover:shadow-md ${
              isDark
                ? "bg-gray-800/70 border-gray-700/80 hover:border-gray-600"
                : "bg-white border-gray-150 hover:border-gray-250"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                {item.icon}
              </div>
              {item.trend && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.trend.startsWith("+")
                      ? isDark
                        ? "bg-green-950/40 text-green-400 border border-green-800/40"
                        : "bg-green-50 text-green-700 border border-green-200"
                      : isDark
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.trend} vs sem. anterior
                </span>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
                {item.value}
              </h3>
              <p
                className={`text-xs font-medium mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}
              >
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div
        className={`rounded-2xl p-6 border ${
          isDark
            ? "bg-gray-800/70 border-gray-700/80"
            : "bg-white border-gray-150 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-heading flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Actividad Reciente
          </h2>
          <span
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Últimas inscripciones y publicaciones
          </span>
        </div>

        {recentActivities.length === 0 ? (
          <p
            className={`text-xs py-8 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            No hay actividad reciente registrada en la plataforma.
          </p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                  isDark
                    ? "bg-gray-900/40 border-gray-700/50 hover:bg-gray-700/30"
                    : "bg-gray-50/70 border-gray-100 hover:bg-gray-100/70"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      activity.type === "event"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {activity.type === "event" ? (
                      <Ticket className="h-4 w-4" />
                    ) : (
                      <GraduationCap className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      <span className="font-bold">{activity.user}</span>{" "}
                      <span
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      >
                        {activity.action}
                      </span>{" "}
                      <span className="font-semibold text-primary">
                        "{activity.item}"
                      </span>
                    </p>
                    <p
                      className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"} mt-0.5`}
                    >
                      {formatRelativeTime(activity.date)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
