import React from "react";

const OpportunityLoading = () => {
  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-9 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6"></div>

        {/* Layout principal: 2 col en desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Detalle (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-6 shadow-sm">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl w-1/2"></div>
              </div>
              <div className="h-64 sm:h-80 w-full bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="h-6 w-14 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              </div>
            </div>

            {/* Body Card skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="h-10 bg-gray-150 dark:bg-gray-850 rounded-xl"></div>
                  <div className="h-10 bg-gray-150 dark:bg-gray-850 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Sidebar info card skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
              <div className="h-12 w-full bg-primary/20 rounded-xl"></div>
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityLoading;
