import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Buttom";
import Input from "../components/ui/Input";
import AuthError from "../components/AuthError";
import { signInWithEmail } from "../services/AuthService";

const Login = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle(); // solo llamas, sin esperar data/error
      // No necesitas manejar redirección aquí
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

    try {
      const { user } = await signInWithEmail(formData.email, formData.password);
      console.log(user);
      if (user) {
        toast.success("¡Inicio de sesión exitoso!");
        navigate("/admin");
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark">Iniciar Sesión</h2>
          <p className="mt-2 text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && <AuthError error={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              label="Correo Electrónico"
              icon={Mail}
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              error={error}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              icon={Lock}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={error}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-primary hover:text-primary/80">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            <Button type="submit" disabled={loading} variant="primary">
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    O continuar con
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant="secondary"
                className="mt-4"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                {loading ? "Iniciando sesión..." : "Iniciar sesión con Google"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
