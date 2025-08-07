import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserMenu from "./UserMenu";
import { useAuth } from "../contexts/AuthContext";
import Button from "./ui/Buttom";
import logo from "../assets/logo_2.png";

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
              to="/about"
              className="font-heading font-medium hover:text-primary px-3 py-2 rounded-md"
            >
              Nosotros
            </Link>
            <Link
              to="/projects"
              className="font-heading font-medium hover:text-primary px-3 py-2 rounded-md"
            >
              Proyectos
            </Link>
            <Link
              to="/edutracker"
              className="font-heading font-medium text-dark hover:text-primary px-3 py-2 rounded-md"
            >
              EDUTRACKER
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
                className="block font-heading font-medium hover:text-primary px-3 py-2 rounded-md"
              >
                Inicio
              </Link>
              <Link
                to="/about"
                className="block font-heading font-medium hover:text-primary px-3 py-2 rounded-md"
              >
                Sobre Nosotros
              </Link>
              <Link
                to="/blog"
                className="block font-heading font-medium hover:text-primary px-3 py-2 rounded-md"
              >
                Blog
              </Link>
              <Link
                to="/edutracker"
                className="block font-heading font-medium text-dark hover:text-primary px-3 py-2 rounded-md"
              >
                Oportunidades
              </Link>
              {isAuthenticated ? (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <UserMenu />
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="primary">Iniciar Sesión</Button>
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
