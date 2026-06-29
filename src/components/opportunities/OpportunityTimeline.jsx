import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

/* ─── Estado del paso ────────────────────────────────────────── */
function StepStatusIcon({ isLast }) {
  if (isLast) return <CheckCircle2 className="w-4 h-4 text-secondary" />;
  return <Clock className="w-4 h-4 text-gray-400" />;
}

/* ─── Paso individual ────────────────────────────────────────── */
function TimelineStep({ step, index, total }) {
  const Icon = step.icon || Clock;
  const isLast = index === total - 1;
  const isFirst = index === 0;

  return (
    <motion.div
      className="relative flex gap-4 lg:flex-col lg:gap-3 lg:p-5 lg:rounded-2xl lg:border lg:border-gray-100 lg:bg-gray-50/20 lg:hover:bg-white lg:hover:shadow-md lg:hover:border-primary/20 lg:transition-all lg:duration-300"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {/* Nodo y línea en móvil, cabecera de la tarjeta en desktop */}
      <div className="flex flex-col items-center flex-shrink-0 lg:flex-row lg:justify-between lg:w-full">
        {/* Nodo de ícono */}
        <div
          className={`
            relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
            transition-all duration-300
            ${
              isFirst
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : isLast
                  ? "bg-secondary/10 text-secondary border border-secondary/30"
                  : "bg-gray-50 text-gray-500 border border-gray-200"
            }
          `}
        >
          <Icon className="w-4 h-4" />
        </div>
        {/* Línea conectora (solo móvil/tablet) */}
        {!isLast && (
          <div
            className="w-px flex-1 mt-1 lg:hidden"
            style={{
              minHeight: "2.5rem",
              background:
                "linear-gradient(to bottom, #e5e7eb 60%, transparent 100%)",
            }}
          />
        )}
        {/* Badge de número de paso (solo desktop) */}
        <span className="hidden lg:inline-flex text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100/70 px-2 py-0.5 rounded-md">
          Paso {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Contenido del paso */}
      <div className={`pb-8 lg:pb-0 ${isLast ? "pb-2" : ""} flex-1 min-w-0`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2 lg:flex-col lg:items-start lg:gap-1.5">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">
            {step.title}
          </h3>
          {step.duration && (
            <span className="flex items-center gap-1 flex-shrink-0 text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5 whitespace-nowrap">
              <StepStatusIcon isLast={isLast} />
              {step.duration}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Componente principal ───────────────────────────────────── */
export default function OpportunityTimeline({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <motion.section
      aria-label="Timeline de postulación"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              Proceso de postulación
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Guía paso a paso para postular correctamente
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 pt-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:pb-6">
        {steps.map((step, i) => (
          <TimelineStep
            key={step.id || i}
            step={step}
            index={i}
            total={steps.length}
          />
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-6 pb-5">
        <div className="rounded-xl bg-secondary/5 border border-secondary/15 p-4 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Cada convocatoria puede tener pasos adicionales. Siempre verifica
            las instrucciones oficiales en el sitio web de la institución.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
