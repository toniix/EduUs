import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Buttom";
import Input from "../components/ui/Input";
import AuthError from "../components/AuthError";

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const validatedData = registerSchema.parse(formData);

      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            name: validatedData.name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success("¡Registro exitoso! Por favor, inicia sesión.");
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else {
        setError(error.message);
      }
      toast.error("Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
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
  return (
    <div className="min-h-screen bg-light py-12 px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark">Crear una Cuenta</h2>
          <p className="mt-2 text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && <AuthError error={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="name"
              name="name"
              type="text"
              label="Nombre Completo"
              icon={User}
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Juan Pérez"
              error={error}
            />

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

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirmar Contraseña"
              icon={Lock}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              error={error}
            />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                Acepto los{" "}
                <a href="#" className="text-primary hover:text-primary/80">
                  términos y condiciones
                </a>
              </label>
            </div>

            {/* Boton de enviar */}
            <Button type="submit" disabled={loading} variante="primary">
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
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

              {/* Boton de iniciar sesión con Google */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant="secondary"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                {loading ? "Registrando..." : "Registrarse con Google"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
