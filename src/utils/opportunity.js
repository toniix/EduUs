import { Clock, CheckCircle, AlertCircle } from "lucide-react";
// Mapeo de tipos a colores y etiquetas
export const typeConfig = {
  beca: { label: "Beca", color: "bg-blue-100 text-blue-800" },
  taller: { label: "Taller", color: "bg-green-100 text-green-800" },
  intercambio: { label: "Intercambio", color: "bg-purple-100 text-purple-800" },
  voluntariado: {
    label: "Voluntariado",
    color: "bg-orange-100 text-orange-800",
  },
  pasantia: { label: "Pasantía", color: "bg-pink-100 text-pink-800" },
  practica: { label: "Práctica", color: "bg-yellow-100 text-yellow-800" },
  curso: { label: "Curso", color: "bg-red-100 text-red-800" },
  bootcamp: { label: "Bootcamp", color: "bg-green-100 text-green-800" },
  hackathon: { label: "Hackathon", color: "bg-blue-100 text-blue-800" },
};

// Mapeo de modalidades a etiquetas
export const modalityConfig = {
  presencial: { label: "Presencial", icon: "🏢" },
  virtual: { label: "Virtual", icon: "💻" },
  hibrido: { label: "Híbrido", icon: "🌐" },
};

export const statusColors = {
  active: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
  closed: { bg: "bg-red-100", text: "text-red-800", icon: AlertCircle },
  draft: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
};

export const modalityStyles = {
  virtual: "bg-green-100 text-green-800 border-green-200",
  presencial: "bg-blue-100 text-blue-800 border-blue-200",
  hibrido: "bg-purple-100 text-purple-800 border-purple-200",
};
