import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600">
            Última actualización: 12 de noviembre de 2025
          </p>
        </div>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Introducción
            </h2>
            <p className="text-gray-700 mb-4">
              Bienvenido/a a EDU-US. Al acceder y utilizar nuestro sitio web,
              aceptas cumplir con estos términos y condiciones. Si no estás de
              acuerdo con alguna parte de estos términos, por favor no utilices
              nuestro sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Uso del Sitio
            </h2>
            <p className="text-gray-700 mb-4">
              Este sitio está destinado a proporcionar información sobre
              nuestros servicios educativos. Te otorgamos un acceso limitado y
              no exclusivo para uso personal del sitio de acuerdo con estos
              términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Cuentas de Usuario
            </h2>
            <p className="text-gray-700 mb-4">
              Al crear una cuenta en nuestro sitio, eres responsable de mantener
              la confidencialidad de tu cuenta y contraseña. Aceptas
              notificarnos inmediatamente de cualquier uso no autorizado de tu
              cuenta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Propiedad Intelectual
            </h2>
            <p className="text-gray-700 mb-4">
              Todo el contenido de este sitio, incluyendo textos, gráficos,
              logotipos, imágenes y software, es propiedad de EDU-US o sus
              proveedores de contenido y está protegido por las leyes de
              propiedad intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-700 mb-4">
              EDU-US no será responsable por ningún daño directo, indirecto,
              incidental o consecuente que resulte del uso o la imposibilidad de
              utilizar los servicios ofrecidos en este sitio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Cambios en los Términos
            </h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Los cambios entrarán en vigor inmediatamente después de
              su publicación en el sitio. Te recomendamos revisar periódicamente
              esta página.
            </p>
          </section>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium"
            >
              ← Volver al registro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
