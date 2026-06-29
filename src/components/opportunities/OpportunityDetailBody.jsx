import { motion } from "framer-motion";
import {
  CheckCircle2,
  Star,
  FileText,
  Sparkles,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

/* ─── Animación de entrada stagger ──────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

/* ─── Componente principal ───────────────────────────────────── */
const DetailBody = ({
  description,
  audience,
  parsedRequirements,
  parsedBenefits,
}) => {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Sección 1: Descripción - Tarjeta Premium Ampliada */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden"
      >
        {/* Adorno visual moderno en el fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-gray-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 heading">
            Descripción
          </h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line max-w-prose relative z-10">
          {description}
        </p>
      </motion.div>

      {/* Sección 2: Audiencia / Candidato Ideal (Bento Target) */}
      {audience && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent rounded-2xl border border-secondary/20 shadow-sm p-6 relative overflow-hidden"
        >
          {/* Ilustración o grid moderno decorativo en esquina */}
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-secondary/10 rounded-full flex items-center justify-center blur-md pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-secondary/25 flex items-center justify-center flex-shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5 text-secondary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" />
                Perfil del Candidato Ideal
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mt-1">
                {audience}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sección 3: Requisitos y Beneficios en Bento-Grid asimétrico */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Requisitos */}
        {parsedRequirements && parsedRequirements.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Bezel decorativo superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20" />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-primary" />
              </div>
              <h2 className="text-base font-bold text-gray-900 heading">
                Requisitos
              </h2>
            </div>

            <ul className="space-y-3.5">
              {parsedRequirements.map((req, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {req}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Columna Beneficios */}
        {parsedBenefits && parsedBenefits.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-white via-white to-secondary/5 rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Bezel decorativo superior */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary/20" />

            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Star className="w-4.5 h-4.5 text-secondary fill-secondary/25" />
              </div>
              <h2 className="text-base font-bold text-gray-900 heading">
                Beneficios
              </h2>
            </div>

            <ul className="space-y-3.5">
              {parsedBenefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="w-3 h-3 text-secondary fill-secondary" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DetailBody;
