import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ImprovedCTA() {
  return (
    <>
      {/* CTA Section Rediseñada y Premium */}
      <section className="relative py-12 sm:pt-12 lg:py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="relative bg-gradient-to-br from-secondary/15 via-secondary/5 to-accent/10 rounded-[3rem] overflow-hidden px-6 py-16 sm:px-16 sm:py-24 shadow-2xl border border-secondary/20">
            {/* Elementos decorativos premium */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              {/* Etiqueta tipo "Pill" */}
              <m.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="inline-block px-5 py-2 rounded-full bg-secondary/10 border border-secondary/30 backdrop-blur-md mb-8"
              >
                <span className="text-slate-800 font-semibold text-sm tracking-widest uppercase">
                  Tu momento es ahora
                </span>
              </m.div>

              {/* Título principal */}
              <m.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight"
              >
                Abre puertas a un{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#b27a00]">
                  futuro sin límites
                </span>
              </m.h2>

              {/* Descripción */}
              <m.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg sm:text-xl text-slate-700 mb-12 leading-relaxed font-medium"
              >
                Accede a becas, voluntariados y oportunidades internacionales
                que otros no conocen. Descubre el camino hacia tu éxito global.
              </m.p>

              {/* Botón CTA */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <a
                  href="https://chat.whatsapp.com/KLGckmNVzvO7nuqWURd1Pf?s=cl&p=i&mlu=3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
                >
                  Únete a la comunidad
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </a>
              </m.div>

              {/* Trust badges */}
              <m.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-12 pt-8 border-t border-secondary/35 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
              >
                {[
                  "Acceso inmediato",
                  "Comunidad activa",
                  "Oportunidades premium",
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center text-slate-800 text-base font-semibold tracking-wide"
                  >
                    <svg
                      className="w-5 h-5 text-primary mr-3 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {badge}
                  </div>
                ))}
              </m.div>
            </div>
          </div>
        </div>
      </section>

      {/* Botón flotante de WhatsApp mejorado */}
      <m.a
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        href="https://chat.whatsapp.com/KLGckmNVzvO7nuqWURd1Pf?s=cl&p=i&mlu=3"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
        aria-label="Chatea con nosotros por WhatsApp"
      >
        {/* Círculo pulsante de fondo */}
        <div className="absolute inset-0 bg-primary rounded-full animate-pulse opacity-75"></div>

        {/* Botón principal */}
        <m.div
          whileHover={{ rotate: 12 }}
          className="relative bg-primary hover:bg-primary/90 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-primary/50 transition-all duration-300"
        >
          {/* Ícono de WhatsApp */}
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </m.div>
      </m.a>
    </>
  );
}
