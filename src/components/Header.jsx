import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";
import UserMenuMobile from "./UserMenuMobile";
import { useAuth } from "../contexts/AuthContext";
import Button from "./ui/Buttom";
import logo from "../assets/logo_2.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const menuRef = useRef(null);
  const location = useLocation();

  // Cierra el menú al navegar a otra ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Abrir menú móvil"]')
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-light shadow-md fixed top-0 left-0 right-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="EDU-US"
                className="h-auto w-auto max-w-[150px] object-cover"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="font-heading font-medium hover:text-primary px-3 py-2 rounded-md"
            >
              Inicio
            </Link>
            <Link
              to="/nosotros"
              className="font-heading font-medium hover:text-primary px-3 py-2 rounded-md"
            >
              Nosotros
            </Link>
            <Link
              to="/proyectos"
              className="font-heading font-medium hover:text-primary px-3 py-2 rounded-md"
            >
              Proyectos
            </Link>
            <Link
              to="/edutracker"
              className="font-heading font-medium text-dark hover:text-primary px-3 py-2 rounded-md"
            >
              Oportunidades
            </Link>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link to="/login">
                <Button variant="primary" fullWidth={false}>
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="text-dark hover:text-primary p-2"
              aria-label="Abrir menú móvil"
              aria-expanded={isOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={closeMenu}
          aria-hidden={!isOpen}
        />
        {/* Drawer */}
        <aside
          ref={menuRef}
          className={`fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-xl transform transition-transform duration-300 md:hidden flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ marginTop: "0" }}
          tabIndex={isOpen ? 0 : -1}
          aria-modal="true"
          role="dialog"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <img
              src={logo}
              alt="EDU-US"
              className="h-10 w-auto object-contain"
            />
            <button
              onClick={closeMenu}
              aria-label="Cerrar menú móvil"
              className="rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <X className="h-6 w-6 text-dark" />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-1 px-4 pt-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="block font-heading font-medium text-dark hover:bg-gray-50 hover:text-primary px-4 py-3 rounded-lg transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              to="/nosotros"
              onClick={closeMenu}
              className="block font-heading font-medium text-dark hover:bg-gray-50 hover:text-primary px-4 py-3 rounded-lg transition-colors duration-200"
            >
              Nosotros
            </Link>
            <Link
              to="/proyectos"
              onClick={closeMenu}
              className="block font-heading font-medium text-dark hover:bg-gray-50 hover:text-primary px-4 py-3 rounded-lg transition-colors duration-200"
            >
              Proyectos
            </Link>
            <Link
              to="/edutracker"
              onClick={closeMenu}
              className="block font-heading font-medium text-dark hover:bg-gray-50 hover:text-primary px-4 py-3 rounded-lg transition-colors duration-200"
            >
              EDUTRACKER
            </Link>
          </nav>
          <div className="mt-auto px-4 pb-6">
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4">
                <UserMenuMobile onItemClick={closeMenu} />
              </div>
            ) : (
              <Link to="/login" onClick={closeMenu} className="block w-full">
                <Button variant="primary" className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </aside>
      </div>
    </nav>
  );
};

export default Header;
