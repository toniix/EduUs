import { Save, Bell, Globe, Shield, Mail } from "lucide-react";

export default function SettingsTab() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-8 pt-24">
      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-primary" />
          Configuración General
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sitio
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              placeholder="EDU-US"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              rows={3}
              placeholder="Descripción del sitio..."
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-primary" />
          Notificaciones
        </h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <div>
              <p className="font-medium text-gray-700">
                Notificaciones por Email
              </p>
              <p className="text-sm text-gray-500">
                Recibe actualizaciones sobre nuevas oportunidades
              </p>
            </div>
          </label>
          <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <div>
              <p className="font-medium text-gray-700">
                Notificaciones de Usuarios
              </p>
              <p className="text-sm text-gray-500">
                Recibe alertas sobre nuevos registros
              </p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Seguridad
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Administrador
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  placeholder="admin@example.com"
                />
              </div>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300">
                Verificar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <button className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center">
          <Save className="h-5 w-5 mr-2" />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
