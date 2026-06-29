import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SidebarDeadlineBlock = ({ deadline, isExpired }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!deadline || isExpired) return;

    const getDeadlineDate = (deadlineStr) => {
      if (typeof deadlineStr === "string" && deadlineStr.includes("-")) {
        const parts = deadlineStr.split("-");
        return new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
      }
      const d = new Date(deadlineStr);
      d.setHours(23, 59, 59, 999);
      return d;
    };

    const targetDate = getDeadlineDate(deadline);

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let left = { days: 0, hours: 0, minutes: 0 };

      if (difference > 0) {
        left = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        };
      }
      return left;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [deadline, isExpired]);

  if (!deadline) return null;

  if (isExpired) {
    return (
      <motion.div
        className="rounded-xl border border-red-200 bg-red-50/50 p-4 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
          Convocatoria cerrada
        </p>
        <p className="text-sm font-medium text-red-700">
          Esta oportunidad ya no recibe postulaciones.
        </p>
      </motion.div>
    );
  }

  const deadlineFormatted = new Date(deadline).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      className="rounded-xl bg-gray-50/50 border border-gray-150 p-4 space-y-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            Vigente
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Cierre:{" "}
          <span className="font-semibold text-gray-800">
            {deadlineFormatted}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="text-center relative after:absolute after:right-0 after:top-2 after:h-8 after:w-px after:bg-gray-250 last:after:hidden">
          <span className="block text-3xl font-extrabold text-rose-500 tracking-tight tabular-nums">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Días
          </span>
        </div>
        <div className="text-center relative after:absolute after:right-0 after:top-2 after:h-8 after:w-px after:bg-gray-250 last:after:hidden">
          <span className="block text-3xl font-extrabold text-rose-500 tracking-tight tabular-nums">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Horas
          </span>
        </div>
        <div className="text-center">
          <span className="block text-3xl font-extrabold text-rose-500 tracking-tight tabular-nums">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Minutos
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SidebarDeadlineBlock;
