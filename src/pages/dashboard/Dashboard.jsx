import { useState, useEffect } from "react";
import OpportunityCard from "./OpportunityCard";
import FilterSection from "./FilterSection";
import Pagination from "./Pagination";
import { Search } from "lucide-react";
import { opportunitiesData } from "../../utils/opportunities";

export default function OpportunitiesDashboard() {
  const [opportunities] = useState(opportunitiesData);
  const [filteredOpportunities, setFilteredOpportunities] =
    useState(opportunitiesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const itemsPerPage = 6;

  // Filtro de oportunidades
  useEffect(() => {
    let result = opportunities;

    if (searchTerm) {
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter((opp) => selectedTypes.includes(opp.type));
    }

    if (selectedLocations.length > 0) {
      result = result.filter((opp) => selectedLocations.includes(opp.location));
    }

    setFilteredOpportunities(result);
    setCurrentPage(1);
  }, [searchTerm, selectedTypes, selectedLocations, opportunities]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOpportunities.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleTypeFilter = (types) => {
    setSelectedTypes(types);
  };

  const handleLocationFilter = (locations) => {
    setSelectedLocations(locations);
  };

  const uniqueLocations = Array.from(
    new Set(opportunities.map((opp) => opp.location))
  );

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Oportunidades para Jóvenes
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre becas, talleres, intercambios y más oportunidades para
          impulsar tu desarrollo personal y profesional.
        </p>
      </div>

      {/* Barra de búsqueda principal */}
      <div className="relative mb-6 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-primary focus:border-primary"
          placeholder="Buscar oportunidades por título, descripción o etiquetas..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Sección de filtros y resultados */}
      <div className="flex flex-col md:flex-row gap-6">
        <FilterSection
          onTypeFilter={handleTypeFilter}
          onLocationFilter={handleLocationFilter}
          locations={uniqueLocations}
          selectedTypes={selectedTypes}
          selectedLocations={selectedLocations}
        />

        <div className="flex-1">
          {/* Contador de resultados */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando{" "}
              <span className="font-medium">
                {filteredOpportunities.length}
              </span>{" "}
              oportunidades
            </p>
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages || 1}
            </div>
          </div>

          {/* Grid de oportunidades */}
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No se encontraron oportunidades con los filtros seleccionados.
              </p>
              <button
                className="mt-4 text-primary hover:underline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTypes([]);
                  setSelectedLocations([]);
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Paginación */}
          {filteredOpportunities.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={paginate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
