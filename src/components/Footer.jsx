import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Mail,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">EDU-US</span>
            </div>
            <p className="mt-4 text-gray-400">
              Comprometidos con brindar educación de calidad y oportunidades
              para todos los jóvenes. Juntos construimos un futuro mejor a
              través del conocimiento.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-primary">
                  Noticias
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-primary"
                >
                  Oportunidades
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="mailto:contact@edu-us.org"
                  className="text-gray-400 hover:text-primary"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} EDU-US. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
