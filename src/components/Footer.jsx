import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import logo from "../assets/logo_3.png";
const socialLinks = [
  {
    icon: FaFacebook,
    href: "https://web.facebook.com/profile.php?id=100090641378967",
    color: "hover:text-blue-400",
    name: "Facebook",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/edu.us_/",
    color: "hover:text-pink-400",
    name: "Instagram",
  },
  {
    icon: FaTiktok,
    href: "https://www.tiktok.com/@edu.us_",
    color: "hover:text-pink-400",
    name: "TikTok",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/edu-us/",
    color: "hover:text-blue-400",
    name: "LinkedIn",
  },
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/@eduus-",
    color: "hover:text-red-400",
    name: "Youtube",
  },
];
const Footer = () => {
  return (
    <footer
      style={{
        background: `linear-gradient(to bottom, #222222, rgba(34, 34, 34, 0.95))`,
        color: "#FFFFFF",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Logo and Description */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start group mb-6">
              <img
                src={logo}
                alt="EDU-US"
                className="h-10 w-auto object-contain"
              />
            </div>

            <p className="text-secondary-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Capacitamos a jóvenes con herramientas blandas, técnicas y
              digitales para impulsar su potencial.
            </p>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center lg:items-end gap-4">
            <h3 className="text-xl font-semibold relative inline-block">
              Síguenos
              <span
                className="absolute -bottom-2 left-0 w-full h-1 rounded-full"
                style={{ backgroundColor: "#ED441D" }}
              ></span>
            </h3>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-white group ${social.color}`}
                  style={{ backgroundColor: "rgba(34, 34, 34, 0.8)" }}
                  title={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="mt-12 pt-8 border-t text-center"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} EDU-US. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
