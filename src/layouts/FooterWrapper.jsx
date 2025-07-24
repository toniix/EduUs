import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const FooterWrapper = () => {
  const location = useLocation();
  const shouldShowFooter = !location.pathname.startsWith("/admin");

  return shouldShowFooter ? <Footer /> : null;
};

export default FooterWrapper;
