import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import {
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Heart,
  ChevronRight,
  Eye,
  Building2,
  Users,
} from "lucide-react";
import { projectsService } from "../services/projectsService";
import {
  partnerBenefits,
  volunteerBenefits,
  partnerCTA,
  volunteerCTA,
} from "../data/joinUsData";
import SEO from "../components/SEO";
import ProjectDrawer from "../components/ProjectDrawer";
import ProjectSlide from "../components/joinus/ProjectSlide";
import BenefitCard from "../components/joinus/BenefitCard";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const JoinUs = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getProjects();
        setProjects(data || []);
      } catch (error) {
        console.error("Error loading projects in JoinUs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // For loop mode to function correctly with slidesPerView up to 2.1 (which requires 6 slides),
  // we duplicate slides when we have 3-5 items, or disable loop mode if we have fewer.
  const slidesToRender =
    projects.length >= 3 && projects.length < 6
      ? [...projects, ...projects]
      : projects;

  const shouldLoop = slidesToRender.length >= 6;

  return (
    <div className="min-h-screen">
      <SEO
        title="Únete — EDU-US | Colabora o sé voluntario"
        description="Descubre cómo puedes unirte a EDU-US como empresa aliada o joven voluntario. Conoce nuestros proyectos de impacto y sé parte del cambio educativo en el Perú."
      />
      {/* ═══════════════════════════════════════════════════════ */}
      {/* STORYTELLING: CONTEXTUAL INTRO + PROJECTS CAROUSEL     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative py-10 sm:py-12 lg:py-16 bg-gradient-to-b from-white via-secondary-light/20 to-white overflow-hidden">
        {/* Subtle decorative bg */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-3xl pointer-events-none" />

        {/* ── Contextual intro (minimal, not a hero) ── */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <m.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-2 bg-secondary/10 rounded-full text-secondary text-xs font-bold uppercase tracking-wider border border-secondary/20 mb-5">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-accent" />
              Únete a EDU-US
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              EDU-US en acción.{" "}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-primary">
                  ¿Te unes al equipo?
                </span>
                <span className="absolute -bottom-1.5 left-0 w-full h-1 bg-gradient-to-r from-secondary/40 via-accent/40 to-primary/40 rounded-full" />
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
              Conoce lo que hemos construido y descubre cómo ser parte.
            </p>
          </m.div>

          {/* ── Quick navigation anchors (moved to top) ── */}
          <m.div
            className="lg:col-span-5 bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-xl shadow-gray-100/40 flex flex-col gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                ¿Cómo participar?
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <button
                onClick={() => scrollTo("cta-empresas")}
                className="group flex items-center justify-between p-4 bg-white hover:bg-secondary/[0.02] rounded-xl border border-gray-200 hover:border-secondary/40 text-left shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary transition-colors">
                      Soy Organización
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Ver cómo colaborar
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => scrollTo("cta-voluntarios")}
                className="group flex items-center justify-between p-4 bg-white hover:bg-primary/[0.02] rounded-xl border border-gray-200 hover:border-primary/40 text-left shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                      Soy Voluntario
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Ver cómo sumarme
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </m.div>
        </div>

        {/* ── Immersive Projects Carousel ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-[320px] sm:h-[380px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No hay proyectos disponibles.
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
              effect="coverflow"
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 120,
                modifier: 2,
                slideShadows: false,
              }}
              centeredSlides={true}
              slidesPerView={1.1}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 1.25, spaceBetween: 20 },
                768: { slidesPerView: 1.5, spaceBetween: 24 },
                1024: { slidesPerView: 2.1, spaceBetween: 28 },
              }}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              loop={shouldLoop}
              className="joinus-swiper !overflow-visible !pb-14"
            >
              {slidesToRender.map((project, idx) => (
                <SwiperSlide key={`${project.id}-${idx}`}>
                  <ProjectSlide
                    project={project}
                    onSelect={() => setSelectedProject(project)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* CTA — EMPRESAS / ORGANIZACIONES                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        id="cta-empresas"
        className="py-10 sm:py-12 lg:py-16 bg-white scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Content */}
            <m.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <m.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center px-4 py-2 bg-secondary/10 rounded-full text-secondary text-xs font-bold uppercase tracking-wider border border-secondary/20">
                  {partnerCTA.subtitle}
                </span>
              </m.div>

              <m.h2
                variants={fadeUp}
                custom={1}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
              >
                {partnerCTA.title.split(" ")[0]}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#2d9a8a]">
                  {partnerCTA.title.split(" ").slice(1).join(" ")}
                </span>
              </m.h2>

              <m.p
                variants={fadeUp}
                custom={2}
                className="text-gray-600 text-lg leading-relaxed"
              >
                {partnerCTA.description}
              </m.p>

              <m.div variants={fadeUp} custom={3}>
                <a
                  href={partnerCTA.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 hover:bg-secondary/90 active:scale-95 transition-all duration-300"
                >
                  {partnerCTA.buttonText}
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </a>
              </m.div>
            </m.div>

            {/* Right — Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pb-6 lg:pb-8">
              {partnerBenefits.map((benefit, index) => (
                <BenefitCard
                  key={benefit.title}
                  benefit={benefit}
                  index={index}
                  variant="light"
                  fadeUp={fadeUp}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* CTA — JÓVENES VOLUNTARIOS                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        id="cta-voluntarios"
        className="relative py-10 sm:py-12 lg:py-16 bg-gradient-to-br from-[#0b2826] via-[#1a4d47] to-[#0b2826] scroll-mt-16 overflow-hidden"
      >
        {/* Decorative bg elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-secondary/5 blur-3xl" />
        </div>
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 pb-6 lg:pb-8 order-2 lg:order-1">
              {volunteerBenefits.map((benefit, index) => (
                <BenefitCard
                  key={benefit.title}
                  benefit={benefit}
                  index={index}
                  variant="dark"
                />
              ))}
            </div>

            {/* Right — Content */}
            <m.div
              className="space-y-6 order-1 lg:order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <m.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center px-4 py-2 bg-primary/15 rounded-full text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                  {volunteerCTA.subtitle}
                </span>
              </m.div>

              <m.h2
                variants={fadeUp}
                custom={1}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
              >
                {volunteerCTA.title.split(" ")[0]}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-[#f5ba3c]">
                  {volunteerCTA.title.split(" ").slice(1).join(" ")}
                </span>
              </m.h2>

              <m.p
                variants={fadeUp}
                custom={2}
                className="text-gray-300 text-lg leading-relaxed"
              >
                {volunteerCTA.description}
              </m.p>

              <m.div variants={fadeUp} custom={3}>
                <a
                  href={volunteerCTA.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all duration-300"
                >
                  {volunteerCTA.buttonText}
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </a>
              </m.div>

              {/* Trust element */}
              <m.div
                variants={fadeUp}
                custom={4}
                className="flex items-center gap-3 pt-2"
              >
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-[#0b2826] bg-gradient-to-br from-secondary/40 to-primary/30 flex items-center justify-center"
                    >
                      <span className="text-[10px] text-white font-bold">
                        {["A", "M", "C", "J"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  <span className="text-white font-semibold">
                    +30 voluntarios
                  </span>{" "}
                  ya forman parte de EDU-US
                </p>
              </m.div>
            </m.div>
          </div>
        </div>
      </section>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* CLOSING CTA BANNER                                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            className="relative bg-gradient-to-br from-secondary/15 via-secondary/5 to-accent/10 rounded-[3rem] p-10 sm:p-14 border border-secondary/20 text-center overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-secondary/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent/10 blur-2xl" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                El siguiente paso
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#b27a00]">
                  {" "}
                  es tuyo.
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Únete como aliado estratégico o voluntario, cada acción cuenta.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={partnerCTA.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all duration-300"
                >
                  Quiero ser aliado
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={volunteerCTA.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 bg-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-dark/90 active:scale-95 transition-all duration-300"
                >
                  Quiero ser voluntario
                  <Heart className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </m.div>
        </div>
      </section>
      <AnimatePresence>
        {selectedProject && (
          <ProjectDrawer
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JoinUs;
