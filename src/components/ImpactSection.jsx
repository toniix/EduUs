import { impactData } from "../data/StastData";
import ImpactCard from "./ImpactCard";

const ImpactSection = () => {
  return (
    <section className="pt-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 lg:px-8 bg-secondary-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-3">
            <span className="relative inline-block">
              <span className="relative z-10"> Nuestro Impacto</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/70 -z-0 transform -rotate-1"></span>
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-12">
          {/* Primer card - Destacado */}
          <div className="w-full lg:w-1/4 transform transition-all duration-500 hover:-translate-y-1">
            <ImpactCard item={impactData[0]} isFeatured={true} />
          </div>

          {/* Grid de 4 cards */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {impactData.slice(1).map((item) => (
                <div
                  key={item.id}
                  className="h-full transform transition-all duration-500 hover:-translate-y-1"
                >
                  <ImpactCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
