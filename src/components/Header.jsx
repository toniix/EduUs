import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Simulamos el estado de autenticación (después lo reemplazaremos con el real)
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-light shadow-md fixed top-0 left-0 right-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-dark">EDU-US</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-dark hover:text-primary px-3 py-2 rounded-md"
            >
              Inicio
            </Link>
            <Link
              to="/about"
              className="text-dark hover:text-primary px-3 py-2 rounded-md"
            >
              Sobre Nosotros
            </Link>
            <Link
              to="/blog"
              className="text-dark hover:text-primary px-3 py-2 rounded-md"
            >
              Blog
            </Link>
            <Link
              to="/news"
              className="text-dark hover:text-primary px-3 py-2 rounded-md"
            >
              Noticias
            </Link>
            <Link
              to="/edutracker"
              className="text-dark hover:text-primary px-3 py-2 rounded-md"
            >
              EDUTRACKER
            </Link>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="bg-primary text-light px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark hover:text-primary"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block text-dark hover:text-primary px-3 py-2 rounded-md"
              >
                Inicio
              </Link>
              <Link
                to="/about"
                className="block text-dark hover:text-primary px-3 py-2 rounded-md"
              >
                Sobre Nosotros
              </Link>
              <Link
                to="/blog"
                className="block text-dark hover:text-primary px-3 py-2 rounded-md"
              >
                Blog
              </Link>
              <Link
                to="/news"
                className="block text-dark hover:text-primary px-3 py-2 rounded-md"
              >
                Noticias
              </Link>
              <Link
                to="/dashboard"
                className="block text-dark hover:text-primary px-3 py-2 rounded-md"
              >
                Oportunidades
              </Link>
              {isAuthenticated ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <UserMenu />
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block bg-primary text-light px-4 py-2 rounded-md hover:bg-opacity-90"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
