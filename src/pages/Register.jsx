import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Buttom";
import Input from "../components/ui/Input";
import AuthError from "../components/auth/AuthError";
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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

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

    // Validar términos y condiciones
    if (!acceptedTerms) {
      setTermsError("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});
    setTermsError("");

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
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img
              src="/logo_1.png"
              alt="Edu-Us Logo"
              className="w-24 h-24 rounded-full object-cover shadow-md hover:shadow-lg transition-shadow duration-300"
            />
          </div>
        </div>

        {/* Tarjeta de registro */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Crea tu cuenta
              </h2>
              <p className="mt-2 text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="text-primary transition-colors">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            {error && <AuthError error={error} className="mb-6" />}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-5">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Nombre Completo"
                  icon={User}
                  // required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  error={fieldErrors.name}
                  className="bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />

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
                  error={fieldErrors.email}
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
                  placeholder="•••••••"
                  error={fieldErrors.password}
                  className="bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirmar Contraseña"
                  icon={Lock}
                  // required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="•••••••"
                  error={fieldErrors.confirmPassword}
                  className="bg-gray-50 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Botón de registro */}
              {/* Términos y condiciones */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        if (e.target.checked) {
                          setTermsError("");
                        }
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-medium text-gray-700"
                    >
                      Acepto los{" "}
                      <a
                        href="/terminos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        Términos y Condiciones
                      </a>{" "}
                      y la{" "}
                      <a
                        href="/privacidad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        Política de Privacidad
                      </a>
                    </label>
                  </div>
                </div>
                {termsError && (
                  <p className="mt-1 text-sm text-red-600">{termsError}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full py-3 text-base font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-sm text-gray-500">
                    O regístrate con
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
        </div>
      </div>
    </div>
  );
};
export default Register;
