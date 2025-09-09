import { offers } from "../data/Offers";

const OfferSection = () => {
  return (
    <section className="pt-8 pb-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 lg:px-8 bg-secondary-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="relative inline-block">
              <span className="relative z-10">¿Qué Ofrecemos?</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/70 -z-0 transform -rotate-1"></span>
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent p-6 hover:-translate-y-1"
            >
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
