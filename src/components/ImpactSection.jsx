import { impactData } from "../data/StastData";
import ImpactCard from "./ImpactCard";
import { motion } from "framer-motion";

const ImpactSection = () => {
  return (
    <section className="py-12 sm:pt-12 lg:py-14 px-4 sm:px-6 lg:px-8 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 mt-3">
            <span className="relative inline-block">
              <span className="relative z-10"> Nuestro Impacto</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/70 -z-0 transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mt-4 px-4">
            Conoce los logros y resultados tangibles que hemos alcanzado junto a nuestra comunidad de estudiantes.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Primer card - Destacado */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/4 transform transition-all duration-500 hover:-translate-y-2"
          >
            <ImpactCard item={impactData[0]} isFeatured={true} />
          </motion.div>

          {/* Grid de 4 cards */}
          <div className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {impactData.slice(1).map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={item.id}
                  className="h-full transform transition-all duration-500 hover:-translate-y-2"
                >
                  <ImpactCard item={item} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
