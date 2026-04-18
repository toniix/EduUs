import { CheckCircle, Star } from "lucide-react";

const DetailBody = ({
  description,
  audience,
  parsedRequirements,
  parsedBenefits,
}) => {
  return (
    <>
      {/* Descripción */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Descripción
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>

      {/* Audiencia */}
      {audience && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ¿Quiénes pueden postular?
          </h2>
          <p className="text-gray-600 leading-relaxed">{audience}</p>
        </div>
      )}

      {/* Requisitos */}
      {parsedRequirements && parsedRequirements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" /> Requisitos
          </h2>
          <ul className="space-y-2">
            {parsedRequirements.map((req, index) => (
              <li key={index} className="flex items-start">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Beneficios */}
      {parsedBenefits && parsedBenefits.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" /> Beneficios
          </h2>
          <ul className="space-y-2">
            {parsedBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default DetailBody;
