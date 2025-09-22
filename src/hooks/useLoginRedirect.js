import { useNavigate, useLocation } from "react-router-dom";
import { signInWithGoogle } from "../services/AuthService";

export const useLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const saveCurrentUrlForRedirect = (returnUrl) => {
    const urlToSave = returnUrl || location.pathname + location.search;
    console.log("urlToSave", urlToSave);
    sessionStorage.setItem("redirectAfterLogin", urlToSave);
  };

  const redirectToLogin = (returnUrl) => {
    saveCurrentUrlForRedirect(returnUrl);
    navigate("/login");
  };

  const loginWithGoogle = async (returnUrl) => {
    // Solo guardar la URL si no hay una ya guardada o si se está forzando una nueva
    if (!sessionStorage.getItem("redirectAfterLogin") || returnUrl) {
      const urlToSave = returnUrl || location.pathname + location.search;
      if (urlToSave !== "/login") {
        sessionStorage.setItem("redirectAfterLogin", urlToSave);
      }
    }
    return await signInWithGoogle();
  };

  return {
    redirectToLogin,
    loginWithGoogle,
    saveCurrentUrlForRedirect,
  };
};
