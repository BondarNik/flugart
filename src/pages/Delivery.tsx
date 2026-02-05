import { Link } from "react-router-dom";
import { ArrowLeft, Truck, CreditCard, MapPin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Delivery = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#050d18]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("goBack")}
        </Link>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("deliveryPageTitle")}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t("deliveryPageSubtitle")}
          </p>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Delivery info */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Truck className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("deliveryInfoTitle")}</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t("deliveryInfoText")}
            </p>
          </div>

          {/* Geography */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <MapPin className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("deliveryGeographyTitle")}</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t("deliveryGeographyText")}
            </p>
          </div>

          {/* Payment methods */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <CreditCard className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("paymentMethodsTitle")}</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{t("paymentCard")}</h3>
                <p className="text-slate-300">{t("paymentCardText")}</p>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{t("paymentPrepayment")}</h3>
                <p className="text-slate-300">{t("paymentPrepaymentText")}</p>
              </div>
            </div>
          </div>

          {/* Contact for questions */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("deliveryQuestionsTitle")}</h2>
            </div>
            <p className="text-slate-300 mb-4">
              {t("deliveryQuestionsTextEmail")}
            </p>
            <a 
              href="mailto:flugart.d@gmail.com" 
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              <Mail className="w-4 h-4" />
              flugart.d@gmail.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Delivery;
