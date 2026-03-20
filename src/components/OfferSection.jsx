import { offers } from "../data/Offers";
import { motion } from "framer-motion";

const OfferSection = () => {
  return (
    <section className="py-12 sm:pt-12 lg:py-14 px-4 sm:px-6 lg:px-8 bg-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="relative inline-block">
              <span className="relative z-10">¿Qué Ofrecemos?</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/70 -z-0 transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mt-4 px-4">
            Explora la variedad de programas y recursos diseñados exclusivamente para impulsar tu futuro profesional.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {offers.map((offer, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="group relative bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] transition-all duration-300 overflow-hidden border border-transparent p-6 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative z-10 w-full h-full">
              <div
                className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${offer.color} shadow-lg mx-auto`}
              >
                <offer.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-3">
                {offer.title}
              </h3>
              <p className="text-gray-600 text-center text-sm sm:text-base">
                {offer.description}
              </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
