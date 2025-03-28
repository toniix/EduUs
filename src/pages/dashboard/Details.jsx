import { useNavigate } from "react-router-dom";
import { useOpportunity } from "../../contexts/OpportunityContext";

const Details = () => {
  const navigate = useNavigate();
  const { selectedOpportunity, setSelectedOpportunity } = useOpportunity();

  if (!selectedOpportunity) {
    navigate("/dashboard");
    return null;
  }

  const handleBack = () => {
    setSelectedOpportunity(null);
    navigate("/dashboard");
  };

  return (
    // Detailed view of selected opportunity
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={handleBack}
        className="flex items-center text-primary mb-6 hover:underline"
      >
        <ChevronRight className="h-5 w-5 transform rotate-180" />
        <span>Volver a oportunidades</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-64 overflow-hidden">
          <img
            src={selectedOpportunity.imageUrl}
            alt={selectedOpportunity.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <div className="flex items-center mb-4">
            {typeIcons[selectedOpportunity.type]}
            <span className="ml-2 text-sm font-medium text-gray-500 capitalize">
              {selectedOpportunity.type}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-dark mb-4">
            {selectedOpportunity.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Detalles</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{selectedOpportunity.country}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    Fecha límite:{" "}
                    {new Date(
                      selectedOpportunity.deadline
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span>{selectedOpportunity.organization}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Requisitos</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {selectedOpportunity.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            {selectedOpportunity.description}
          </p>

          <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors">
            Aplicar Ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
