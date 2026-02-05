import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DroneBackground from "@/components/DroneBackground";

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#050d18] text-foreground relative">
      <DroneBackground />
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            {t("home")}
          </Link>
          <span>/</span>
          <span className="text-foreground">{t("privacyPolicy")}</span>
        </nav>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("goBack")}
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("privacyPolicy")}
            </h1>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-cyan-400">{t("privacyIntroTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("privacyIntroText")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-cyan-400">{t("privacyDataCollectionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">{t("privacyDataCollectionText")}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>{t("privacyDataItem1")}</li>
                <li>{t("privacyDataItem2")}</li>
                <li>{t("privacyDataItem3")}</li>
                <li>{t("privacyDataItem4")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-cyan-400">{t("privacyDataUseTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">{t("privacyDataUseText")}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>{t("privacyUseItem1")}</li>
                <li>{t("privacyUseItem2")}</li>
                <li>{t("privacyUseItem3")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-cyan-400">{t("privacyDataProtectionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("privacyDataProtectionText")}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-cyan-400">{t("privacyRightsTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">{t("privacyRightsText")}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>{t("privacyRightsItem1")}</li>
                <li>{t("privacyRightsItem2")}</li>
                <li>{t("privacyRightsItem3")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-cyan-400">{t("privacyContactTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacyContactText")} <a href="mailto:flugart.d@gmail.com" className="text-cyan-400 hover:text-cyan-300">flugart.d@gmail.com</a>
              </p>
            </section>

            <p className="text-sm text-muted-foreground pt-4 border-t border-border/50">
              {t("privacyLastUpdated")}: 13.12.2024
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
