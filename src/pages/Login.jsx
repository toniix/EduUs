import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Buttom";
import Input from "../components/ui/Input";
import AuthError from "../components/auth/AuthError";
import {
  signInWithEmail,
  resendConfirmationEmail,
} from "../services/AuthService";
import { useLoginRedirect } from "../hooks/useLoginRedirect";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showResendButton, setShowResendButton] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const { loginWithGoogle } = useLoginRedirect();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setError(error.message);
      toast.error("Error al iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowResendButton(false);

    try {
      const { user } = await signInWithEmail(formData.email, formData.password);

      if (user) {
        toast.success("¡Inicio de sesión exitoso!");
      }
    } catch (error) {
      console.error("Error login:", error);

      if (
        error.message?.includes("Email not confirmed") ||
        error.message?.includes("email_not_confirmed")
      ) {
        setError(
          "Tu email aún no ha sido confirmado. Revisa tu bandeja de entrada y confirma tu cuenta."
        );
        setShowResendButton(true);
        setPendingEmail(formData.email);
        toast.error("Email no confirmado");
      } else if (
        error.message?.includes("Invalid login credentials") ||
        error.message?.includes("invalid_credentials")
      ) {
        setError(
          "Email o contraseña incorrectos. Por favor, verifica tus datos."
        );
        toast.error("Credenciales incorrectas");
      } else if (error.message?.includes("Too many requests")) {
        setError(
          "Demasiados intentos. Por favor, espera un momento antes de intentar nuevamente."
        );
        toast.error("Demasiados intentos");
      } else {
        setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        toast.error("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setLoading(true);

    try {
      await resendConfirmationEmail(pendingEmail);
      toast.success(
        "Email de confirmación reenviado. Revisa tu bandeja de entrada."
      );
      setShowResendButton(false);
    } catch (error) {
      // console.error("Error reenviando email:", error);
      toast.error("Error al reenviar el email. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 ">
      <div className="w-full max-w-md">
        {/* Logo o título de la aplicación */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img
              src="/logo_1.png"
              alt="Edu-Us Logo"
              className="w-24 h-24 rounded-full object-cover shadow-md hover:shadow-lg transition-shadow duration-300"
            />
          </div>
        </div>

        {/* Tarjeta de inicio de sesión */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Bienvenido de nuevo
              </h2>
              <p className="mt-2 text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-secondary font-medium hover:text-secondary transition-colors"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {error && <AuthError error={error} className="mb-6" />}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-5">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Correo Electrónico"
                  icon={Mail}
                  // required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Contraseña"
                  icon={Lock}
                  // required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Botón de reenviar confirmación */}
              {showResendButton && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={loading}
                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                  >
                    {loading
                      ? "Reenviando..."
                      : "¿No recibiste el correo? Reenviar verificación"}
                  </button>
                </div>
              )}

              {/* Botón de iniciar sesión */}
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full py-3 text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-sm text-gray-500">
                    O continúa con
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <Button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  variant="outline"
                  className="w-full py-2.5 text-gray-700 bg-white border-gray-300 hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span>Google</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Pie de página */}
          {/* <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-xs text-gray-500">
              Al continuar, aceptas nuestros{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Términos de servicio
              </a>{" "}
              y{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Política de privacidad
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
