// src/pages/opportunities/InactiveOpportunities.jsx
import { useState } from "react";
import { useInactiveOpportunities } from "../../hooks/useOpportunities";
import OpportunityCard from "../../components/opportunities/OpportunityCard";
import Pagination from "../../components/Pagination";

export default function InactiveOpportunities() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { opportunities, totalCount, totalPages, loading, error, refetch } =
    useInactiveOpportunities({
      page: currentPage,
      limit: itemsPerPage,
    });

  if (loading) return <div>Cargando oportunidades inactivas...</div>;
  if (error)
    return <div>Error al cargar las oportunidades: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Oportunidades Inactivas</h1>

      <div className="mb-4">
        <p>Total de oportunidades inactivas: {totalCount}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {opportunities.length === 0 && (
        <div className="text-center py-8">
          <p>No hay oportunidades inactivas en este momento.</p>
        </div>
      )}
    </div>
  );
}
