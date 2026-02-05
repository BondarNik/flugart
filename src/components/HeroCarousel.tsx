import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroFpvDrone from "@/assets/hero-fpv-drone.jpg";
import heroBattery from "@/assets/hero-battery-new.jpg";
import heroFiberWide from "@/assets/hero-fiber-wide.jpg";
import hero3dPrint from "@/assets/hero-3d-print.jpg";
import heroMambaKit from "@/assets/hero-mamba-kit.jpg";
import heroTaipanKit from "@/assets/hero-taipan-kit.jpg";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  const slides = [
    {
      id: 1,
      title: t("heroFpvTitle"),
      subtitle: t("heroFpvSubtitle"),
      badge: t("heroFpvBadge"),
      image: heroFpvDrone,
    },
    {
      id: 2,
      title: t("heroBatteryTitle"),
      subtitle: t("heroBatterySubtitle"),
      badge: t("heroBatteryBadge"),
      image: heroBattery,
    },
    {
      id: 3,
      title: t("heroFiberTitle"),
      subtitle: t("heroFiberSubtitle"),
      badge: t("heroFiberBadge"),
      image: heroFiberWide,
    },
    {
      id: 4,
      title: t("hero3dTitle"),
      subtitle: t("hero3dSubtitle"),
      badge: t("hero3dBadge"),
      image: hero3dPrint,
    },
    {
      id: 5,
      title: t("heroTaipanKitTitle"),
      subtitle: t("heroTaipanKitSubtitle"),
      badge: t("heroTaipanKitBadge"),
      image: heroMambaKit,
    },
    {
      id: 6,
      title: t("heroMambaTitle"),
      subtitle: t("heroMambaSubtitle"),
      badge: t("heroMambaBadge"),
      image: heroTaipanKit,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 md:mx-0 my-4">
      <div className="relative h-[400px] md:h-[500px] lg:h-[550px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Subtle gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto flex items-center">
              <div className="hero-fade-in max-w-xl p-6 md:p-8">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-cyan-400 mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {slide.title}
                </h1>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {slide.subtitle}
                </h2>
                <div className="inline-block bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold text-sm mb-6 shadow-lg">
                  {slide.badge}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-cyan-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:border-cyan-400 transition-all duration-300 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-cyan-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:border-cyan-400 transition-all duration-300 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-cyan-500 w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
