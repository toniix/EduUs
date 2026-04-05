import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "./UserMenu";
import UserMenuMobile from "./UserMenuMobile";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo_2.png";

const NAV_ITEMS = [
  { name: "Inicio", path: "/" },
  { name: "Nosotros", path: "/nosotros" },
  { name: "Proyectos", path: "/proyectos" },
  { name: "Oportunidades", path: "/edutracker" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const drawerRef = useRef(null);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Cerrar al navegar */
  useEffect(() => { setIsOpen(false); }, [location]);

  /* Cerrar con Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /* Bloquear scroll del body */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
          ${scrolled
            ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-black/5"
            : "bg-white/60 backdrop-blur-lg border-b border-slate-100/40"
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img
              src={logo}
              alt="EDU-US"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </Link>

          {/* ── Desktop nav ── */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 block 
                      ${active
                        ? "text-secondary"
                        : "text-gray-900 hover:text-secondary hover:bg-secondary/5"
                      }
                      `}
                  >
                    {item.name}
                    {/* Indicador activo con shared-layout animation */}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg bg-secondary/8 border border-secondary/15"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link to="/login">
                <button className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm shadow-primary/25">
                  Iniciar sesión
                </button>
              </Link>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-black/5 active:bg-black/10 transition-colors"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ── */}
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-black/5 flex flex-col md:hidden transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <img src={logo} alt="EDU-US" className="h-9 w-auto object-contain" />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 pt-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${active
                  ? "text-primary bg-primary/8 border border-primary/15"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                )}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 pb-6 pt-4 border-t border-gray-100">
          {isAuthenticated ? (
            <UserMenuMobile onItemClick={() => setIsOpen(false)} />
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block">
              <button className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-150">
                Iniciar sesión
              </button>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}