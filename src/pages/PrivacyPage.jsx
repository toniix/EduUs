import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES – EDU-US
          </h1>
          <p className="text-gray-600">
            Última actualización: 12 de noviembre de 2025
          </p>
        </div>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              1. Identificación del titular del banco de datos personales
            </h2>
            <p className="text-gray-700 mb-4">
              EDU-US es una iniciativa juvenil sin fines de lucro que busca
              empoderar a jóvenes a través de la educación. Es titular del banco
              de datos personales recopilados mediante su plataforma web
              eduus.club y otros canales oficiales de contacto. El tratamiento
              de los datos se realiza conforme a la Ley N.º 29733 – Ley de
              Protección de Datos Personales, su Reglamento (D.S. N.º
              003-2013-JUS) y demás normas complementarias, respetando los
              principios de legalidad, consentimiento, finalidad,
              proporcionalidad, seguridad y calidad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Finalidad del tratamiento
            </h2>
            <p className="text-gray-700 mb-4">
              Los datos personales proporcionados por los usuarios serán
              tratados para los siguientes fines legítimos y proporcionales:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>
                a) Gestión de usuarios: registrar, autenticar y mantener cuentas
                activas en la plataforma.
              </li>
              <li>
                b) Comunicación educativa: enviar recordatorios, avisos o
                actualizaciones sobre becas, talleres, intercambios y
                conferencias.
              </li>
              <li>
                c) Optimización del servicio: mejorar la experiencia del usuario
                mediante análisis estadístico o de preferencias.
              </li>
              <li>
                d) Cumplimiento legal: atender requerimientos de autoridades
                competentes o mandatos judiciales.
              </li>
              <li>
                e) Difusión institucional: difundir, con consentimiento previo,
                testimonios, imágenes o aportes de los usuarios en medios
                oficiales de EDU-US
              </li>
              <li>
                f) Comunicación comercial: enviar información sobre nuevas
                oportunidades, alianzas, programas o servicios educativos
                ofrecidos por EDU-US o por organizaciones aliadas, siempre
                dentro del ámbito educativo, formativo o de desarrollo juvenil.
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              En ningún caso se utilizarán los datos personales para fines
              comerciales ajenos al propósito educativo y sin consentimiento
              previo del usuario.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Datos personales tratados
            </h2>
            <p className="text-gray-700 mb-4">
              Los datos personales que podrán ser recopilados incluyen:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Nombre y apellidos</li>
              <li>Correo electrónico</li>
              <li>País o región de residencia</li>
              <li>Intereses académicos o preferencias educativas</li>
              <li>
                Información sobre becas, talleres, intercambios y conferencias
              </li>
              <li>
                Información opcional que el usuario decida compartir (por
                ejemplo, edad o institución educativa)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Banco de datos personales y plazo de conservación
            </h2>
            <p className="text-gray-700 mb-4">
              Los datos personales se incorporarán en el banco denominado
              “Usuarios EDU-US”, gestionado directamente por la organización. El
              periodo de conservación será de cinco (5) años desde la última
              interacción del usuario con la plataforma o hasta que solicite la
              eliminación de su cuenta o datos. Cumplido el plazo, los datos
              serán eliminados o anonimizados, salvo que exista obligación legal
              distinta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Cesión o comunicación de datos personales
            </h2>
            <p className="text-gray-700 mb-4">
              EDU-US no comercializa ni cede datos personales a terceros con
              fines lucrativos. No obstante, podrá compartirlos únicamente en
              los siguientes supuestos controlados:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>
                1.Por mandato legal o requerimiento de autoridad competente.
              </li>
              <li>
                2.Con proveedores tecnológicos o de comunicación, que presten
                servicios de alojamiento, envío de correos o mantenimiento de la
                plataforma, bajo contrato y cláusulas de confidencialidad que
                garanticen el cumplimiento de la Ley N.º 29733.
              </li>
              <li>
                3.Con aliados o instituciones educativas asociadas, para ofrecer
                oportunidades o programas formativos relevantes y coherentes con
                el propósito educativo de EDU-US, siempre previa autorización
                expresa del usuario.
              </li>
              <li>
                4.Transferencias internacionales de datos, únicamente cuando los
                servidores o servicios utilizados se ubiquen fuera del Perú y
                garanticen niveles adecuados de protección de datos personales.
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              En todos los casos, EDU-US velará porque los terceros receptores
              utilicen la información exclusivamente para las finalidades
              autorizadas y bajo las medidas de seguridad aplicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              6. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
            </h2>
            <p className="text-gray-700 mb-4">
              El usuario podrá ejercer sus derechos de:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>
                <span className="font-semibold">Acceso:</span> conocer qué datos
                posee EDU-US y cómo se utilizan.
              </li>
              <li>
                <span className="font-semibold">Rectificación:</span> solicitar
                la corrección de información inexacta.
              </li>
              <li>
                <span className="font-semibold">Cancelación:</span> solicitar la
                eliminación de sus datos personales.
              </li>
              <li>
                <span className="font-semibold">Oposición:</span> solicitar la
                suspensión del tratamiento de sus datos personales.
              </li>
            </ul>
            <p className="text-gray-700 mb-4">
              Las solicitudes deben enviarse al correo eduus.latam@gmail.com,
              indicando nombre completo, correo registrado y el derecho que
              desea ejercer. EDU-US confirmará la recepción y atenderá el pedido
              conforme al procedimiento y plazos establecidos por la Ley N.º
              29733.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              7. Consentimiento informado
            </h2>
            <p className="text-gray-700 mb-4">
              Al registrarse o utilizar los servicios de EDU-US, el usuario
              declara haber leído y comprendido la presente política, otorgando
              su consentimiento libre, previo, expreso e informado para el
              tratamiento de sus datos personales conforme a las finalidades
              descritas. El consentimiento podrá revocarse en cualquier momento,
              sin efectos retroactivos, escribiendo a eduus.latam@gmail.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Seguridad de la información
            </h2>
            <p className="text-gray-700 mb-4">
              EDU-US implementa medidas técnicas, organizativas y legales para
              proteger los datos personales frente a accesos no autorizados,
              pérdida, alteración o destrucción, entre ellas:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>
                <span className="font-semibold">
                  Control de acceso y autenticación de usuarios.
                </span>
              </li>
              <li>
                <span className="font-semibold">
                  Protocolos de encriptación y respaldo de datos.
                </span>
              </li>
              <li>
                <span className="font-semibold">
                  Políticas internas de confidencialidad y capacitación.
                </span>
              </li>
              <li>
                <span className="font-semibold">
                  Monitoreo y revisión periódica del cumplimiento normativo.
                </span>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              9. Vigencia y modificaciones
            </h2>
            <p className="text-gray-700 mb-4">
              Esta política entra en vigencia en la fecha indicada y permanecerá
              aplicable mientras se mantengan las finalidades que justificaron
              la recopilación de los datos personales. EDU-US podrá actualizar
              la presente política en cualquier momento, notificando los cambios
              mediante su sitio web o por correo electrónico.
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

export default PrivacyPage;
