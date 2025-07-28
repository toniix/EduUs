import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Buttom";
import Input from "../components/ui/Input";
import AuthError from "../components/AuthError";
import { registerUser, checkEmailExists } from "../services/AuthService";
import { registerSchema } from "../utils/validationSchemas";

const Register = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: "",
    });
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // 1. Validar datos del formulario
      const validatedData = registerSchema.parse(formData);

      // 2. Verificar si el email ya existe (validación temprana)
      const emailExists = await checkEmailExists(validatedData.email);
      if (emailExists) {
        setFieldErrors({ email: "Este email ya está registrado" });
        toast.error("El email ya está en uso");
        return;
      }

      // 3. Registrar usuario
      const { user } = await registerUser({
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      });

      if (!user) {
        throw new Error("Error al crear el usuario");
      }

      toast.success(
        "¡Registro exitoso! Revisa tu email para confirmar tu cuenta."
      );
      navigate("/login");
    } catch (error) {
      console.error("Error en registro:", error);

      if (error instanceof z.ZodError) {
        const newFieldErrors = {};
        error.errors.forEach((err) => {
          newFieldErrors[err.path[0]] = err.message;
        });
        setFieldErrors(newFieldErrors);
        toast.error("Por favor, corrige los errores en el formulario");
      } else {
        const errorMessage =
          error.message || "Error inesperado durante el registro";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
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
              error={fieldErrors.name}
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
              error={fieldErrors.email}
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
              error={fieldErrors.password}
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
              error={fieldErrors.confirmPassword}
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
