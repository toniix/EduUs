export default function ResultsSummary({
  totalCount,
  currentPage,
  totalPages,
}) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-gray-600">
        Mostrando <span className="font-medium text-primary">{totalCount}</span>{" "}
        oportunidades
      </p>
      {totalPages > 0 && (
        <div className="text-gray-600">
          Página {currentPage} de {totalPages}
        </div>
      )}
    </div>
  );
}
