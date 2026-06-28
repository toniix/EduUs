import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import MarqueeLib from "react-fast-marquee";
const Marquee = MarqueeLib.default ?? MarqueeLib;

import {
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Heart,
  ChevronRight,
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

const _transitionSpring = {
  type: "spring",
  stiffness: 100,
  damping: 20,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] },
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

  const minItems = 6;
  const normalizedProjects =
    projects.length > 0 && projects.length < minItems
      ? Array.from(
          { length: Math.ceil(minItems / projects.length) },
          () => projects,
        ).flat()
      : projects;

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden w-full max-w-full">
      <SEO
        title="Únete — EDU-US | Colabora o sé voluntario"
        description="Descubre cómo puedes unirte a EDU-US como empresa aliada o joven voluntario. Conoce nuestros proyectos de impacto y sé parte del cambio educativo en el Perú."
      />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO / STORYTELLING SECTION                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-white via-secondary-light/20 to-white overflow-hidden">
        {/* Soft radial mesh orbs for premium visual depth */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline */}
          <m.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/10 rounded-full text-secondary text-[11px] font-bold uppercase tracking-[0.15em] border border-secondary/20">
              <Sparkles className="w-3 h-3 text-accent animate-pulse" />
              Únete a EDU-US
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.05] max-w-2xl font-heading">
              EDU-US en acción.{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-primary">
                  ¿Te unes al equipo?
                </span>
                <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gradient-to-r from-secondary/30 via-accent/30 to-primary/30 rounded-full" />
              </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg font-light">
              Explora los proyectos que hemos construido y descubre cómo transformar la educación y el desarrollo juvenil en el Perú.
            </p>
          </m.div>

          {/* Right Column: Quick Navigation Card (Double Bezel Design) */}
          <m.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Outer Bezel */}
            <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-100/50">
              {/* Inner Core */}
              <div className="bg-white p-6 sm:p-8 rounded-[calc(2rem-0.375rem)] shadow-[inset_0_1px_2px_rgba(255,255,255,1)] space-y-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 font-heading">
                    ¿Cómo quieres participar?
                  </span>
                </div>
                
                <div className="flex flex-col gap-3.5">
                  <button
                    onClick={() => scrollTo("cta-empresas")}
                    className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-secondary/[0.03] rounded-2xl border border-gray-100 hover:border-secondary/30 text-left active:scale-[0.98] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white group-hover:scale-105 transition-all duration-300 shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary transition-colors font-heading">
                          Soy Organización
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-light">
                          Ver opciones de colaboración
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => scrollTo("cta-voluntarios")}
                    className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/[0.03] rounded-2xl border border-gray-100 hover:border-primary/30 text-left active:scale-[0.98] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all duration-300 shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors font-heading">
                          Soy Voluntario
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5 font-light">
                          Ver cómo sumarme al equipo
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        </div>

        {/* Nuestros Proyectos Highlights Header */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 font-heading">
            Proyectos en marcha
          </h3>
          <span className="h-[1px] bg-gray-200/60 flex-grow" />
        </div>

        {/* ── Immersive Projects Marquee ── */}
        <div className="relative mt-6 overflow-hidden">
          {/* Edge fade gradient masks */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 sm:w-48 bg-gradient-to-r from-white via-white/50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 sm:w-48 bg-gradient-to-l from-white via-white/50 to-transparent" />

          {loading ? (
            <div className="flex justify-center items-center h-[320px] sm:h-[380px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500 font-light">
              No hay proyectos disponibles en este momento.
            </div>
          ) : (
            <div className="flex flex-col">
              <Marquee
                speed={40}
                pauseOnHover
                gradient={false}
                className="flex gap-6 py-8"
              >
                {normalizedProjects.map((project, idx) => (
                  <div
                    key={`project-${project.id}-${idx}`}
                    className="mx-4 w-[280px] sm:w-[340px] lg:w-[380px] shrink-0"
                  >
                    <ProjectSlide
                      project={project}
                      onSelect={() => setSelectedProject(project)}
                    />
                  </div>
                ))}
              </Marquee>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CTA — EMPRESAS / ORGANIZACIONES                       */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        id="cta-empresas"
        className="py-20 lg:py-28 bg-white scroll-mt-16 border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left — Content */}
            <m.div
              className="lg:col-span-6 space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <m.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center px-3 py-1 bg-secondary/10 rounded-full text-secondary text-[11px] font-bold uppercase tracking-[0.15em] border border-secondary/20">
                  {partnerCTA.subtitle}
                </span>
              </m.div>

              <m.h2
                variants={fadeUp}
                custom={1}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight font-heading"
              >
                {partnerCTA.title.split(" ")[0]}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#2d9a8a]">
                  {partnerCTA.title.split(" ").slice(1).join(" ")}
                </span>
              </m.h2>

              <m.p
                variants={fadeUp}
                custom={2}
                className="text-gray-600 text-lg leading-relaxed font-light"
              >
                {partnerCTA.description}
              </m.p>

              <m.div variants={fadeUp} custom={3} className="pt-2">
                {/* Island Button Architecture (Button-in-Button) */}
                <a
                  href={partnerCTA.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between bg-secondary text-white pl-7 pr-2.5 py-2.5 rounded-full font-bold text-base shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 hover:bg-secondary/95 active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  <span className="mr-6 font-heading">Ser aliado estratégico</span>
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-45">
                    <ArrowUpRight className="w-4.5 h-4.5 text-white" />
                  </div>
                </a>
              </m.div>
            </m.div>

            {/* Right — Benefits grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
      {/* CTA — JÓVENES VOLUNTARIOS (FLOATING DARK CONTAINER)    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        id="cta-voluntarios"
        className="py-16 sm:py-20 lg:py-24 bg-white scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Floating Dark Core Card Block to ensure Page Theme Lock */}
          <m.div
            className="relative bg-gradient-to-br from-[#0b2826] via-[#123e39] to-[#0b2826] rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-[#1a4d47]/30 shadow-2xl shadow-[#0b2826]/25 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Ambient glows inside dark card */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-primary/10 blur-[80px]" />
              <div className="absolute bottom-[-25%] left-[-10%] w-96 h-96 rounded-full bg-secondary/15 blur-[90px]" />
            </div>
            
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left — Benefits grid */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
                {volunteerBenefits.map((benefit, index) => (
                  <BenefitCard
                    key={benefit.title}
                    benefit={benefit}
                    index={index}
                    variant="dark"
                    fadeUp={fadeUp}
                  />
                ))}
              </div>

              {/* Right — Content */}
              <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                <div>
                  <span className="inline-flex items-center px-3 py-1 bg-primary/15 rounded-full text-primary text-[11px] font-bold uppercase tracking-[0.15em] border border-primary/25">
                    {volunteerCTA.subtitle}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight font-heading">
                  {volunteerCTA.title.split(" ")[0]}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-[#f5ba3c]">
                    {volunteerCTA.title.split(" ").slice(1).join(" ")}
                  </span>
                </h2>

                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  {volunteerCTA.description}
                </p>

                <div className="pt-2">
                  {/* Island Button Architecture (Button-in-Button) */}
                  <a
                    href={volunteerCTA.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-between bg-primary text-white pl-7 pr-2.5 py-2.5 rounded-full font-bold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/95 active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  >
                    <span className="mr-6 font-heading">Ser voluntario</span>
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-45">
                      <ArrowUpRight className="w-4.5 h-4.5 text-white" />
                    </div>
                  </a>
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className="flex -space-x-2.5">
                    {["A", "M", "C", "J"].map((letter, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-[1.5px] border-[#0c2f2c] bg-gradient-to-br from-secondary/40 to-primary/30 flex items-center justify-center shadow-md shadow-black/10"
                      >
                        <span className="text-[10px] text-white font-bold tracking-tight">
                          {letter}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    Únete a los{" "}
                    <span className="text-white font-bold">+30 jóvenes</span> que
                    ya lideran el cambio
                  </p>
                </div>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CLOSING CTA BANNER                                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <m.div
            className="relative bg-gradient-to-br from-secondary/10 via-secondary/5 to-accent/10 rounded-[3rem] p-10 sm:p-16 border border-secondary/20 text-center overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Ambient gradients */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-secondary/15 blur-[60px]" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-accent/10 blur-[60px]" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight font-heading">
                El siguiente paso{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#b27a00]">
                  es tuyo.
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                Cada aporte e iniciativa cuenta. Elige cómo ser parte de nuestra red educativa de alto impacto.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                {/* Secondary styled Button-in-Button */}
                <a
                  href={partnerCTA.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto inline-flex items-center justify-between bg-primary text-white pl-6 pr-2 py-2 rounded-full font-bold shadow-md shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 hover:bg-primary/95 active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  <span className="mr-6 font-heading text-sm">Quiero ser aliado</span>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </a>
                
                {/* Dark styled Button-in-Button */}
                <a
                  href={volunteerCTA.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto inline-flex items-center justify-between bg-dark text-white pl-6 pr-2 py-2 rounded-full font-bold hover:bg-dark/95 active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                >
                  <span className="mr-6 font-heading text-sm">Quiero ser voluntario</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
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
