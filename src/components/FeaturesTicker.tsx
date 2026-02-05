import { Award, Zap, Shield, FlaskConical, Factory, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesTicker = () => {
  const { t } = useLanguage();

  const features = [
    { icon: CheckCircle, textKey: "feature1" },
    { icon: Zap, textKey: "feature2" },
    { icon: Award, textKey: "feature3" },
    { icon: Shield, textKey: "feature4" },
    { icon: FlaskConical, textKey: "feature5" },
    { icon: Factory, textKey: "feature6" },
  ];

  return (
    <section className="py-6 bg-secondary overflow-hidden">
      <div className="ticker-scroll flex">
        {/* Duplicate for seamless loop */}
        {[...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-8 shrink-0"
          >
            <feature.icon className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {t(feature.textKey)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesTicker;
