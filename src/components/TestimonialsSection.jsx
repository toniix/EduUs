import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "../data/testimonials";
import { useRef } from "react";

const TestimonialsSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="relative py-12 sm:pt-12 lg:py-14 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
      {/* Background Watermark Icon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none z-0">
        <Quote className="w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] text-blue-900" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="relative inline-block">
              <span className="relative z-10">Testimonios</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/70 -z-0 transform -rotate-1"></span>
            </span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mt-4 px-4">
            Conoce las experiencias de quienes ya han dado el siguiente paso en
            su formación gracias a nuestra iniciativa.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-5xl mx-auto group">
          {/* Gradientes */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-18 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-18 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

          {/* 🔥 BOTÓN IZQUIERDO MEJORADO */}
          <button
            ref={prevRef}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 
            w-10 h-10 sm:w-12 sm:h-12 
            flex items-center justify-center
            rounded-full 
            bg-white/80 backdrop-blur-md 
            text-primary 
            border border-white/30 
            shadow-md
            transition-all duration-300 
            hover:bg-primary hover:text-white 
            hover:shadow-lg
            active:scale-95
            opacity-0 group-hover:opacity-100
            hidden md:flex"
            aria-label="Testimonial anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* 🔥 BOTÓN DERECHO MEJORADO */}
          <button
            ref={nextRef}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
            w-10 h-10 sm:w-12 sm:h-12 
            flex items-center justify-center
            rounded-full 
            bg-white/80 backdrop-blur-md 
            text-primary 
            border border-white/30 
            shadow-md
            transition-all duration-300 
            hover:bg-primary hover:text-white 
            hover:shadow-lg
            active:scale-95
            opacity-0 group-hover:opacity-100
            hidden md:flex"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={40}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".testimonial-pagination",
              bulletClass:
                "w-2.5 h-2.5 mx-1 rounded-full bg-gray-300 inline-block",
              bulletActiveClass: "bg-blue-600 w-8",
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 30,
                centeredSlides: true,
              },
              1024: {
                slidesPerView: 1.5,
                spaceBetween: 20,
                centeredSlides: true,
              },
            }}
            slidesPerGroup={1}
            className="pb-16 px-4"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] p-8 h-full flex flex-col mx-auto max-w-md transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-50 relative">
                  <div className="flex-grow">
                    <Quote className="w-8 h-8 text-blue-100 mb-4" />
                    <p className="text-gray-600 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                  </div>

                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="testimonial-pagination text-center mt-8" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
