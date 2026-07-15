const OpportunityProcessTimeline = ({ deadline, created_at }) => {
  if (!deadline) return null;

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const today = new Date();

  // Parsear la fecha límite en hora local
  let deadlineDate;
  if (typeof deadline === "string" && deadline.includes("-")) {
    const parts = deadline.split("-");
    deadlineDate = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
  } else {
    deadlineDate = new Date(deadline);
    deadlineDate.setHours(23, 59, 59, 999);
  }

  // Fecha de inicio (created_at o 30 días antes de la fecha límite)
  let startDate;
  if (created_at) {
    startDate = new Date(created_at);
  } else {
    startDate = new Date(deadlineDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Evaluación (cierre + 4 días)
  const evaluationDate = new Date(deadlineDate);
  evaluationDate.setDate(deadlineDate.getDate() + 4);
  evaluationDate.setHours(23, 59, 59, 999);

  // Selección (cierre + 7 días)
  const selectionDate = new Date(deadlineDate);
  selectionDate.setDate(deadlineDate.getDate() + 7);
  selectionDate.setHours(23, 59, 59, 999);

  // Formatear GMT offset
  const offset = -today.getTimezoneOffset() / 60;
  const timezoneStr = `GMT${offset >= 0 ? "+" : ""}${offset}`;

  const startStr = formatDate(startDate);
  const deadlineStr = formatDate(deadlineDate);
  const evalStr = formatDate(evaluationDate);
  const selectionStr = formatDate(selectionDate);

  const steps = [
    {
      label: `Inscripciones abiertas del ${startStr} al ${deadlineStr} | 23:59 (${timezoneStr})`,
    },
    {
      label: `Evaluación de solicitudes hasta el ${evalStr}`,
    },
    {
      label: `Selección de candidatos el ${selectionStr}`,
    },
    {
      label: "Proceso finalizado",
    },
  ];

  // Determinar paso activo
  let activeStep = 0;
  if (today > selectionDate) {
    activeStep = 3;
  } else if (today > evaluationDate) {
    activeStep = 2;
  } else if (today > deadlineDate) {
    activeStep = 1;
  } else {
    activeStep = 0;
  }

  return (
    <div className="pt-2 pb-3 border-b border-gray-100/80">
      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
        Proceso de inscripción
      </h4>
      <div className="relative pl-8 space-y-4">
        {/* Línea vertical conectora */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <div key={step.label} className="relative flex items-start">
              {/* Nodo indicador */}
              <div className="absolute left-[-32px] top-0.5 w-6 h-6 flex items-center justify-center">
                {isActive ? (
                  <div className="w-5 h-5 rounded-full border-2 border-primary bg-white flex items-center justify-center ring-4 ring-primary/10">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                )}
              </div>
              {/* Contenido */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13px] leading-relaxed ${
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500 font-normal"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpportunityProcessTimeline;
