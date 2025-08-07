import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Quote } from "lucide-react";

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: "María García",
    role: "Estudiante de Desarrollo Web",
    content:
      "Gracias a los programas de EduUs, pude conseguir mi primer trabajo como desarrolladora. ¡La formación fue increíble y los mentores son expertos en su campo!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    role: "Emprendedor",
    content:
      "Los talleres prácticos me dieron las herramientas necesarias para lanzar mi propio negocio digital. ¡Altamente recomendado!",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/42.jpg",
  },
  {
    id: 3,
    name: "Ana Torres",
    role: "Diseñadora UX/UI",
    content:
      "La comunidad de aprendizaje es increíble. He conocido a profesionales talentosos y he crecido mucho gracias a las mentorías.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    name: "Javier Rojas",
    role: "Estudiante de Marketing Digital",
    content:
      "El contenido es de alta calidad y muy actualizado. Me ha ayudado a mantenerme relevante en mi carrera profesional.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 5,
    name: "Javier Rojas",
    role: "Estudiante de Marketing Digital",
    content:
      "El contenido es de alta calidad y muy actualizado. Me ha ayudado a mantenerme relevante en mi carrera profesional.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="pt-8 pb-8 sm:pt-12 lg:pt-16 px-4 sm:px-6 lg:px-8 bg-secondary-light">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="relative inline-block">
              <span className="relative z-10">Testimonios</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100/70 -z-0 transform -rotate-1"></span>
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-5xl mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              el: ".testimonial-pagination",
              bulletClass:
                "w-2.5 h-2.5 mx-1 rounded-full bg-gray-300 inline-block",
              bulletActiveClass: "bg-blue-600 w-8",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 30,
                centeredSlides: true,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 40,
                centeredSlides: true,
              },
            }}
            slidesPerGroup={1}
            className="pb-16 px-4"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col mx-auto max-w-md">
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
