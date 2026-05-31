import { m } from "framer-motion";

const BenefitCard = ({ benefit, index, variant = "light", fadeUp }) => {
  const IconComponent = benefit.icon;
  const isLight = variant === "light";
  const isStaggered = index % 2 === 1;

  return (
    <m.div
      className={`group relative ${isStaggered ? "sm:translate-y-4 lg:translate-y-6" : ""}`}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div
        className={`relative h-full p-6 rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${
          isLight
            ? "bg-white border-gray-100 shadow-sm hover:shadow-xl hover:shadow-secondary/10 hover:border-secondary/30"
            : "bg-white/[0.06] backdrop-blur-md border-white/10 hover:bg-white/[0.12] hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(236,69,29,0.1)]"
        }`}
      >
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
            isLight
              ? "bg-secondary/10 group-hover:bg-secondary group-hover:shadow-lg group-hover:shadow-secondary/25"
              : "bg-primary/15 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/25"
          }`}
        >
          <IconComponent
            className={`w-6 h-6 transition-colors duration-300 ${
              isLight
                ? "text-secondary group-hover:text-white"
                : "text-primary group-hover:text-white"
            }`}
          />
        </div>
        <h4
          className={`text-lg font-bold mb-2 ${
            isLight ? "text-gray-900" : "text-white"
          }`}
        >
          {benefit.title}
        </h4>
        <p
          className={`text-sm leading-relaxed ${
            isLight ? "text-gray-600" : "text-gray-300"
          }`}
        >
          {benefit.description}
        </p>
      </div>
    </m.div>
  );
};
export default BenefitCard;
