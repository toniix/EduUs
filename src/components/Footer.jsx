import { Link } from "react-router-dom";
import { GraduationCap, Mail } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaTiktok,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-dark to-dark/95 text-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center group">
              <GraduationCap className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EDU-US
              </span>
            </div>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Comprometidos con brindar educación de calidad y oportunidades
              para todos los jóvenes. Juntos construimos un futuro mejor a
              través del conocimiento.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              Enlaces Rápidos
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {["about", "Blog", "News"].map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[2px] bg-primary mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              Contacto
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h3>
            <div className="flex gap-4">
              {[
                { icon: FaFacebook, href: "#", color: "hover:text-blue-500" },
                {
                  icon: FaInstagram,
                  href: "https://www.instagram.com/edu.us_/",
                  color: "hover:text-pink-500",
                },
                {
                  icon: FaTiktok,
                  href: "https://www.tiktok.com/@eduus_latam",
                  color: "hover:text-pink-500",
                },
                {
                  icon: FaLinkedin,
                  href: "https://www.linkedin.com/company/eduus-latam/",
                  color: "hover:text-blue-500",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`bg-dark/50 p-3 rounded-lg ${social.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-white`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} EDU-US. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
