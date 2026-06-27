import { m } from "framer-motion";

const BenefitCard = ({ benefit, index, variant = "light", fadeUp }) => {
  const IconComponent = benefit.icon;
  const isLight = variant === "light";

  return (
    <m.div
      className="group relative h-full"
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Outer Shell */}
      <div
        className={`h-full p-1.5 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1.5 ${
          isLight
            ? "bg-gray-50/60 border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(77,185,169,0.08)] hover:border-secondary/30"
            : "bg-white/[0.02] border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(236,69,29,0.15)] hover:border-primary/30"
        }`}
      >
        {/* Inner Core */}
        <div
          className={`h-full p-6 sm:p-7 rounded-[calc(2rem-0.375rem)] transition-colors duration-500 ${
            isLight
              ? "bg-white border border-gray-50 shadow-[inset_0_1.5px_2px_rgba(255,255,255,1)]"
              : "bg-[#0c2f2c]/50 backdrop-blur-md border border-white/[0.03] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
          }`}
        >
          {/* Icon Bezel */}
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isLight
                ? "bg-secondary/15 group-hover:bg-secondary group-hover:shadow-lg group-hover:shadow-secondary/20 group-hover:scale-110 group-hover:rotate-3"
                : "bg-primary/20 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-110 group-hover:rotate-3"
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
            className={`text-lg font-bold mb-2.5 tracking-tight font-heading ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            {benefit.title}
          </h4>
          <p
            className={`text-sm leading-relaxed ${
              isLight ? "text-gray-500" : "text-gray-300"
            }`}
          >
            {benefit.description}
          </p>
        </div>
      </div>
    </m.div>
  );
};
export default BenefitCard;
