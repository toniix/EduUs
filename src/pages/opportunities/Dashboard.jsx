import { useState, useEffect } from "react";
import OpportunityCard from "../../components/opportunities/OpportunityCard";
import FilterSection from "../../components/opportunities/FilterSection";
import Pagination from "../../components/Pagination";
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
    // ENVOLVER EN EL ADMIN LAYOUT
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary mb-3 bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">
            ¡Descubre y aprovecha las mejores oportunidades para jóvenes!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-6">
            ¡Explora becas, talleres y experiencias únicas para transformar tu
            futuro! Encuentra la oportunidad perfecta para crecer, aprender y
            conectar con el mundo.
          </p>
        </div>
        {/* Barra de búsqueda principal */}
        <div className="relative mb-8 max-w-xl mx-auto transform transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-primary" />
          </div>
          <input
            type="text"
            className="block w-full p-3 pl-10 text-base border-2 border-gray-200 rounded-xl 
                     bg-white shadow-sm transition-all duration-300
                     focus:ring-4 focus:ring-primary/20 focus:border-primary
                     hover:border-primary/50"
            placeholder="Buscar oportunidades por título, descripción o etiquetas..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {/* Sección de filtros y resultados */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros - Sticky */}
          <div className="lg:w-1/4">
            <div
              className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-gray-100
                          transition-all duration-300 hover:shadow-md"
            >
              <FilterSection
                onTypeFilter={handleTypeFilter}
                onLocationFilter={handleLocationFilter}
                locations={uniqueLocations}
                selectedTypes={selectedTypes}
                selectedLocations={selectedLocations}
              />
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Contador de resultados */}
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600">
                Mostrando{" "}
                <span className="font-medium text-primary">
                  {filteredOpportunities.length}
                </span>{" "}
                oportunidades
              </p>
              <div className="text-gray-600">
                Página {currentPage} de {totalPages || 1}
              </div>
            </div>

            {/* Grid de oportunidades */}
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentItems.map((opportunity) => (
                  <OpportunityCard
                    key={opportunity.id}
                    opportunity={opportunity}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">
                  No se encontraron oportunidades con los filtros seleccionados.
                </p>
                <button
                  className="mt-4 text-primary hover:text-primary/80 font-medium 
                           transition-colors duration-300"
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
    </div>
  );
}
