const ImpactCard = ({ item, isFeatured = false }) => {
  const bgGradient = isFeatured
    ? "bg-gradient-to-br from-blue-50 to-white"
    : "bg-white";

  const shadow = isFeatured
    ? "shadow-lg hover:shadow-xl"
    : "shadow-md hover:shadow-lg";

  const padding = isFeatured ? "p-6 sm:p-8" : "p-5 sm:p-6";

  return (
    <div
      className={`group relative ${bgGradient} rounded-xl ${padding} h-full
    border border-gray-100
    transition-all duration-300 ${shadow} hover:border-transparent
    flex flex-col justify-between overflow-hidden`}
    >
      <div className="relative flex flex-col h-full z-10">
        {/* Number */}
        <div className="mb-2">
          <h3
            className={`text-4xl md:text-5xl font-bold leading-none bg-gradient-to-r ${item.color} bg-clip-text text-[#222222]`}
          >
            {item.number}
          </h3>
        </div>

        {/* Title */}
        <h4 className="text-2xl font-heading font-semibold text-gray-800 mb-2">
          {item.title}
        </h4>

        {/* Description */}
        <div className="flex-grow">
          <p
            className={`text-gray-600 ${
              isFeatured ? "text-base" : "text-sm"
            } leading-relaxed`}
          >
            {item.description}
          </p>
        </div>

        {/* Icon */}
        {/* <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${item.color} bg-opacity-10`}>
              <item.icon
                className={`w-5 h-5 ${item.color}`}
                strokeWidth={1.8}
              />
            </div>
          </div>
          {isFeatured && (
            <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              Destacado
            </span>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ImpactCard;
