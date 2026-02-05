import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-secondary">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">
            {t("aboutTitle")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {t("aboutText")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
