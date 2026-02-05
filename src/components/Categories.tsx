import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroFpvDrone from "@/assets/hero-fpv-drone.jpg";
import heroBattery from "@/assets/hero-battery-new.jpg";
import heroFiberWide from "@/assets/hero-fiber-wide.jpg";
import hero3dPrint from "@/assets/hero-3d-print.jpg";
import heroTaipanKit from "@/assets/hero-taipan-kit.jpg";
import station24685Styled from "@/assets/ground-stations/station-24685-styled.jpg";

const Categories = () => {
  const { t } = useLanguage();

  const categories = [
    {
      id: 1,
      title: t("uavKits"),
      subtitle: t("fullEquipment"),
      slug: "БпАК",
      image: heroTaipanKit,
    },
    {
      id: 2,
      title: t("fpvDrones"),
      subtitle: t("variousSizes"),
      slug: "FPV Дрони",
      image: heroFpvDrone,
    },
    {
      id: 3,
      title: t("groundStationsCategory"),
      subtitle: t("controlSystems"),
      slug: "Наземні станції",
      image: station24685Styled,
    },
    {
      id: 4,
      title: t("batteries"),
      subtitle: t("customOrder"),
      slug: "Акумулятори",
      image: heroBattery,
    },
    {
      id: 5,
      title: t("fiberSpools"),
      subtitle: t("forDrones"),
      slug: "Котушки з оптоволокном",
      image: heroFiberWide,
    },
    {
      id: 6,
      title: t("printing3d"),
      subtitle: t("onDemand"),
      slug: "3D Друк",
      image: hero3dPrint,
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          {t("ourServices")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/search?category=${encodeURIComponent(category.slug)}`}
              className="group relative h-[250px] rounded-xl overflow-hidden"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl font-bold text-white mb-1">
                  {category.title}
                </h3>
                <p className="text-white/80 text-sm mb-3">
                  {category.subtitle}
                </p>
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>{t("view")}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
