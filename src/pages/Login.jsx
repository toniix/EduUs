import { useReducer } from "react";
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

const formInitialState = {
  loading: false,
  error: null,
  email: "",
  password: "",
  showResendButton: false,
  pendingEmail: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "FIELD_CHANGE":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
        error: null,
      };
    case "SUBMIT_START":
      return { ...state, loading: true, error: null, showResendButton: false };
    case "EMAIL_NOT_CONFIRMED":
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        showResendButton: true,
        pendingEmail: action.payload.email,
      };
    case "SUBMIT_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SUBMIT_END":
      return { ...state, loading: false };
    case "RESEND_SUCCESS":
      return { ...state, loading: false, showResendButton: false };
    default:
      return state;
  }
}

const Login = () => {
  const [state, dispatch] = useReducer(formReducer, formInitialState);
  const { loading, error, email, password, showResendButton, pendingEmail } =
    state;

  const { loginWithGoogle } = useLoginRedirect();

  const handleGoogleSignIn = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await loginWithGoogle();
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Error al iniciar sesión con Google");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleChange = (e) => {
    dispatch({
      type: "FIELD_CHANGE",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_START" });

    try {
      const { user } = await signInWithEmail(email, password);

      if (user) {
        toast.success("¡Inicio de sesión exitoso!");
      }
    } catch (error) {
      console.error("Error login:", error);

      if (
        error.message?.includes("Email not confirmed") ||
        error.message?.includes("email_not_confirmed")
      ) {
        dispatch({
          type: "EMAIL_NOT_CONFIRMED",
          payload: {
            error:
              "Tu email aún no ha sido confirmado. Revisa tu bandeja de entrada y confirma tu cuenta.",
            email,
          },
        });
        toast.error("Email no confirmado");
      } else if (
        error.message?.includes("Invalid login credentials") ||
        error.message?.includes("invalid_credentials")
      ) {
        dispatch({
          type: "SUBMIT_ERROR",
          payload:
            "Email o contraseña incorrectos. Por favor, verifica tus datos.",
        });
        toast.error("Credenciales incorrectas");
      } else if (error.message?.includes("Too many requests")) {
        dispatch({
          type: "SUBMIT_ERROR",
          payload:
            "Demasiados intentos. Por favor, espera un momento antes de intentar nuevamente.",
        });
        toast.error("Demasiados intentos");
      } else {
        dispatch({
          type: "SUBMIT_ERROR",
          payload: "Error al iniciar sesión. Por favor, inténtalo de nuevo.",
        });
        toast.error("Error al iniciar sesión");
      }
    } finally {
      dispatch({ type: "SUBMIT_END" });
    }
  };

  const handleResendConfirmation = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      await resendConfirmationEmail(pendingEmail);
      toast.success(
        "Email de confirmación reenviado. Revisa tu bandeja de entrada.",
      );
      dispatch({ type: "RESEND_SUCCESS" });
    } catch (error) {
      toast.error("Error al reenviar el email. Inténtalo más tarde.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-light flex items-center justify-center p-4 ">
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
                <Link to="/register" className="text-primary transition-colors">
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
                  value={email}
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
                  value={password}
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
