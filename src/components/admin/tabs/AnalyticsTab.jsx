import { BarChart2, TrendingUp, Users, FileText, ArrowUp } from "lucide-react";

export default function AnalyticsTab() {
  return (
    <div className="space-y-6 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">Usuarios Totales</h3>
              <p className="text-3xl font-bold text-primary">1,234</p>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm">12% desde el mes pasado</span>
              </div>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Contenido Publicado
              </h3>
              <p className="text-3xl font-bold text-secondary">456</p>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm">8% desde el mes pasado</span>
              </div>
            </div>
            <div className="bg-secondary/10 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">Aplicaciones</h3>
              <p className="text-3xl font-bold text-accent">789</p>
              <div className="flex items-center mt-2 text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm">15% desde el mes pasado</span>
              </div>
            </div>
            <div className="bg-accent/10 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Actividad Mensual</h3>
          <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
            <option>Últimos 30 días</option>
            <option>Últimos 90 días</option>
            <option>Este año</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center border border-gray-200 rounded-xl">
          <BarChart2 className="h-8 w-8 text-gray-400" />
          <p className="ml-2 text-gray-500">
            Gráfico de actividad (Placeholder)
          </p>
        </div>
      </div>
    </div>
  );
}
